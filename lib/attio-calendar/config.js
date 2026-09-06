"use strict";

/**
 * Konfiguration der Attio -> Google Kalender Integration.
 * Alle Werte kommen aus Umgebungsvariablen (Vercel Project Settings).
 * Siehe docs/integrations/attio-google-calendar.md und .env.example.
 */

function readServiceAccount(raw) {
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // Vercel-UI kodiert mehrzeilige Werte gelegentlich base64; zweiter Versuch.
    try {
      parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    } catch (_) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON ist kein gueltiges JSON");
    }
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON braucht client_email und private_key");
  }
  return parsed;
}

function loadConfig(env = process.env) {
  const durationMinutes = Number.parseInt(env.EVENT_DURATION_MINUTES || "60", 10);
  const allDayIfNoTime = (env.EVENT_ALL_DAY_WITHOUT_TIME || "true").toLowerCase() !== "false";
  const completedTasks = (env.ATTIO_COMPLETED_TASKS || "keep").toLowerCase();

  if (!["keep", "delete"].includes(completedTasks)) {
    throw new Error("ATTIO_COMPLETED_TASKS muss 'keep' oder 'delete' sein");
  }
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error("EVENT_DURATION_MINUTES muss eine positive Zahl sein");
  }

  return {
    attio: {
      apiToken: env.ATTIO_API_TOKEN || "",
      webhookSecret: env.ATTIO_WEBHOOK_SECRET || "",
      baseUrl: (env.ATTIO_API_BASE_URL || "https://api.attio.com").replace(/\/$/, ""),
      // Nur Tasks, deren Text mit diesem Praefix beginnt (z. B. "Termin:").
      // Leer = jede Task mit Deadline wird synchronisiert.
      taskPrefix: (env.ATTIO_TASK_PREFIX || "").trim(),
      completedTasks
    },
    google: {
      serviceAccount: readServiceAccount(env.GOOGLE_SERVICE_ACCOUNT_JSON),
      // Zielkalender. Im Delegationsmodus "primary" moeglich, sonst die
      // Kalender-ID, die fuer den Service-Account freigegeben wurde.
      calendarId: env.GOOGLE_CALENDAR_ID || "",
      // Domain-weite Delegation: E-Mail des Workspace-Nutzers, in dessen
      // Namen geschrieben wird, oder "assignee" fuer den Task-Verantwortlichen.
      impersonateUser: (env.GOOGLE_IMPERSONATE_USER || "").trim(),
      timeZone: env.EVENT_TIMEZONE || "Europe/Berlin",
      durationMinutes,
      allDayIfNoTime,
      // Kommagetrennte Liste von Domains, deren Adressen als Teilnehmer
      // eingeladen werden duerfen (nur im Delegationsmodus).
      attendeeDomains: (env.EVENT_ATTENDEE_DOMAINS || "")
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean),
      tokenUrl: env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token",
      calendarApiBase: (env.GOOGLE_CALENDAR_API_BASE || "https://www.googleapis.com/calendar/v3").replace(/\/$/, "")
    }
  };
}

function assertRuntimeConfig(config) {
  const missing = [];
  if (!config.attio.apiToken) missing.push("ATTIO_API_TOKEN");
  if (!config.attio.webhookSecret) missing.push("ATTIO_WEBHOOK_SECRET");
  if (!config.google.serviceAccount) missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!config.google.calendarId && !config.google.impersonateUser) {
    missing.push("GOOGLE_CALENDAR_ID (oder GOOGLE_IMPERSONATE_USER)");
  }
  if (missing.length) {
    throw new Error(`Fehlende Konfiguration: ${missing.join(", ")}`);
  }
}

module.exports = { loadConfig, assertRuntimeConfig, readServiceAccount };
