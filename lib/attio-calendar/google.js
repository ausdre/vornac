"use strict";

const crypto = require("node:crypto");

/**
 * Google Calendar ueber einen Service-Account, ohne externe Abhaengigkeiten.
 * Authentifizierung per signiertem JWT (RS256) gegen den OAuth2-Token-Endpunkt.
 *
 * Zwei Betriebsarten:
 *  - Freigegebener Kalender: der Kalender ist fuer die Service-Account-Adresse
 *    mit "Aenderungen an Terminen vornehmen" freigegeben. Kein Admin noetig.
 *  - Domain-weite Delegation: der Service-Account handelt als Workspace-Nutzer
 *    (subject). Erst dann duerfen Teilnehmer eingeladen werden.
 */

const SCOPE = "https://www.googleapis.com/auth/calendar.events";

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function buildJwt(serviceAccount, { subject, tokenUrl, now = Math.floor(Date.now() / 1000) }) {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: tokenUrl,
    iat: now,
    exp: now + 3600
  };
  if (subject) claims.sub = subject;
  const payload = base64url(JSON.stringify(claims));
  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), serviceAccount.private_key);
  return `${signingInput}.${base64url(signature)}`;
}

class GoogleApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "GoogleApiError";
    this.status = status;
    this.body = body;
  }
}

function createGoogleCalendarClient(googleConfig, fetchImpl = globalThis.fetch) {
  const { serviceAccount, tokenUrl, calendarApiBase } = googleConfig;
  if (!serviceAccount) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON fehlt");

  // Token-Cache pro Subject (ein Vercel-Container bedient mehrere Aufrufe).
  const tokens = new Map();

  async function getAccessToken(subject) {
    const key = subject || "";
    const cached = tokens.get(key);
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

    const assertion = buildJwt(serviceAccount, { subject, tokenUrl });
    const res = await fetchImpl(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion
      }).toString()
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.access_token) {
      throw new GoogleApiError(
        `Google Token-Endpunkt antwortete mit ${res.status}${body.error ? ` (${body.error}: ${body.error_description || ""})` : ""}`,
        res.status,
        body
      );
    }
    tokens.set(key, { token: body.access_token, expiresAt: Date.now() + (body.expires_in || 3600) * 1000 });
    return body.access_token;
  }

  async function api(subject, method, path, { query, json } = {}) {
    const token = await getAccessToken(subject);
    const url = new URL(`${calendarApiBase}${path}`);
    for (const [k, v] of Object.entries(query || {})) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
    const res = await fetchImpl(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {})
      },
      body: json ? JSON.stringify(json) : undefined
    });
    if (res.status === 204) return null;
    const text = await res.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (_) {
      body = text;
    }
    if (!res.ok) {
      const detail = body && body.error && body.error.message ? `: ${body.error.message}` : "";
      throw new GoogleApiError(`Google Calendar ${method} ${path} antwortete mit ${res.status}${detail}`, res.status, body);
    }
    return body;
  }

  const enc = encodeURIComponent;

  return {
    async getEvent({ subject, calendarId, eventId }) {
      try {
        return await api(subject, "GET", `/calendars/${enc(calendarId)}/events/${enc(eventId)}`);
      } catch (err) {
        if (err instanceof GoogleApiError && (err.status === 404 || err.status === 410)) return null;
        throw err;
      }
    },

    async insertEvent({ subject, calendarId, event, sendUpdates = "none" }) {
      return api(subject, "POST", `/calendars/${enc(calendarId)}/events`, { query: { sendUpdates }, json: event });
    },

    async patchEvent({ subject, calendarId, eventId, event, sendUpdates = "none" }) {
      return api(subject, "PATCH", `/calendars/${enc(calendarId)}/events/${enc(eventId)}`, {
        query: { sendUpdates },
        json: event
      });
    },

    async deleteEvent({ subject, calendarId, eventId, sendUpdates = "none" }) {
      try {
        await api(subject, "DELETE", `/calendars/${enc(calendarId)}/events/${enc(eventId)}`, { query: { sendUpdates } });
        return true;
      } catch (err) {
        if (err instanceof GoogleApiError && (err.status === 404 || err.status === 410)) return false;
        throw err;
      }
    }
  };
}

module.exports = { createGoogleCalendarClient, buildJwt, GoogleApiError, SCOPE };
