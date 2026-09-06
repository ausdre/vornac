"use strict";

/**
 * Vercel Serverless Function: Attio Webhook -> Google Kalender.
 *
 * Attio ruft diese URL bei task.created / task.updated / task.deleted auf.
 * Jede Task mit Deadline wird als Kalendertermin angelegt, aktualisiert
 * oder entfernt. Einrichtung: docs/integrations/attio-google-calendar.md
 *
 * URL in Production: https://www.vornac.com/api/attio-calendar-webhook
 */

const { loadConfig, assertRuntimeConfig } = require("../lib/attio-calendar/config");
const { verifySignature } = require("../lib/attio-calendar/signature");
const { createAttioClient } = require("../lib/attio-calendar/attio");
const { createGoogleCalendarClient } = require("../lib/attio-calendar/google");
const { createSyncer } = require("../lib/attio-calendar/sync");

const MAX_BODY_BYTES = 1024 * 1024;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === "string") return resolve(req.body);
    if (Buffer.isBuffer(req.body)) return resolve(req.body.toString("utf8"));
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Body zu gross"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

let cached = null;
function getSyncer() {
  if (cached) return cached;
  const config = loadConfig();
  assertRuntimeConfig(config);
  const attio = createAttioClient(config.attio);
  const google = createGoogleCalendarClient(config.google);
  cached = { config, syncer: createSyncer({ config, attio, google, log: console }) };
  return cached;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET" || req.method === "HEAD") {
    // Health-Check ohne Geheimnisse; hilft beim Einrichten des Webhooks.
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, service: "attio-calendar-webhook" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let runtime;
  try {
    runtime = getSyncer();
  } catch (err) {
    console.error("Konfiguration unvollstaendig", err.message);
    return res.status(500).json({ error: "misconfigured" });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: "bad_body" });
  }

  const signature = req.headers["attio-signature"];
  if (!verifySignature(rawBody, signature, runtime.config.attio.webhookSecret)) {
    return res.status(401).json({ error: "invalid_signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (_) {
    return res.status(400).json({ error: "invalid_json" });
  }

  const results = await runtime.syncer.handleWebhookPayload(payload);
  const failed = results.filter((r) => r.action === "error");
  console.log("attio-calendar-webhook", JSON.stringify({ webhook_id: payload.webhook_id, results }));

  // 5xx bei Fehlern, damit Attio den Aufruf wiederholt.
  return res.status(failed.length ? 502 : 200).json({ ok: failed.length === 0, results });
};

// Roh-Body wird fuer die HMAC-Pruefung gebraucht; Vercel darf nicht vorparsen.
module.exports.config = { api: { bodyParser: false } };
