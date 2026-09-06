"use strict";

const crypto = require("node:crypto");

/**
 * Prueft die Attio-Webhook-Signatur.
 * Attio sendet im Header "Attio-Signature" den hex-kodierten
 * HMAC-SHA256 ueber den rohen Request-Body, Schluessel ist das Webhook-Secret.
 */
function computeSignature(rawBody, secret) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

function verifySignature(rawBody, headerValue, secret) {
  if (!secret || typeof headerValue !== "string" || !headerValue) return false;
  const expected = Buffer.from(computeSignature(rawBody, secret), "utf8");
  const received = Buffer.from(headerValue.trim().toLowerCase(), "utf8");
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

module.exports = { computeSignature, verifySignature };
