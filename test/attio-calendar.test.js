"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { EventEmitter } = require("node:events");

const { computeSignature, verifySignature } = require("../lib/attio-calendar/signature");
const mapping = require("../lib/attio-calendar/mapping");
const { loadConfig, assertRuntimeConfig } = require("../lib/attio-calendar/config");
const { buildJwt, createGoogleCalendarClient } = require("../lib/attio-calendar/google");
const { createAttioClient } = require("../lib/attio-calendar/attio");
const { createSyncer } = require("../lib/attio-calendar/sync");

const TASK_ID = "14dc4211-91b7-4b94-a65f-da42d20768ed";
const MEMBER_ID = "099051fd-5c6e-465e-acda-f0fe41cc0b02";
const COMPANY_OBJECT = "fed02cb9-9fc7-478f-abe8-c0bae334d35b";
const COMPANY_ID = "7d5eea9d-c832-45ac-93e3-33c172b37b92";

const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const SERVICE_ACCOUNT = {
  client_email: "sync@example.iam.gserviceaccount.com",
  private_key: privateKey.export({ type: "pkcs8", format: "pem" })
};

function baseEnv(overrides = {}) {
  return {
    ATTIO_API_TOKEN: "attio-token",
    ATTIO_WEBHOOK_SECRET: "whsec",
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify(SERVICE_ACCOUNT),
    GOOGLE_CALENDAR_ID: "team@group.calendar.google.com",
    ...overrides
  };
}

function sampleTask(overrides = {}) {
  return {
    id: { workspace_id: "ws", task_id: TASK_ID },
    content_plaintext: "Termin: Erstgespräch ProMinent\nAgenda: PoC Umfang",
    deadline_at: "2026-09-10T08:00:00.000000000Z",
    is_completed: false,
    linked_records: [{ target_object_id: COMPANY_OBJECT, target_record_id: COMPANY_ID }],
    assignees: [{ referenced_actor_type: "workspace-member", referenced_actor_id: MEMBER_ID }],
    ...overrides
  };
}

test("signature: round trip and rejection", () => {
  const body = '{"events":[]}';
  const sig = computeSignature(body, "whsec");
  assert.equal(verifySignature(body, sig, "whsec"), true);
  assert.equal(verifySignature(body, sig.toUpperCase(), "whsec"), true);
  assert.equal(verifySignature(body, sig, "other"), false);
  assert.equal(verifySignature(body + " ", sig, "whsec"), false);
  assert.equal(verifySignature(body, undefined, "whsec"), false);
  assert.equal(verifySignature(body, "", "whsec"), false);
  assert.equal(verifySignature(body, sig, ""), false);
});

test("mapping: deterministic event id in base32hex alphabet", () => {
  const id = mapping.eventIdForTask(TASK_ID);
  assert.equal(id, "attio14dc421191b74b94a65fda42d20768ed");
  assert.match(id, /^[a-v0-9]{5,1024}$/);
  assert.equal(mapping.taskIdForEvent(id), TASK_ID);
  assert.equal(mapping.taskIdForEvent("something-else"), null);
  assert.throws(() => mapping.eventIdForTask("nope"));
});

test("mapping: classification honours deadline, prefix and completion", () => {
  assert.deepEqual(mapping.classifyTask(sampleTask({ deadline_at: null })), { sync: false, reason: "no-deadline" });
  assert.deepEqual(mapping.classifyTask(sampleTask(), { taskPrefix: "Termin:" }), { sync: true, reason: "ok" });
  assert.deepEqual(mapping.classifyTask(sampleTask({ content_plaintext: "Angebot senden" }), { taskPrefix: "Termin:" }), {
    sync: false,
    reason: "prefix-mismatch"
  });
  assert.deepEqual(mapping.classifyTask(sampleTask({ is_completed: true }), { completedTasks: "delete" }), {
    sync: false,
    reason: "completed"
  });
  assert.deepEqual(mapping.classifyTask(sampleTask({ is_completed: true }), { completedTasks: "keep" }), {
    sync: true,
    reason: "ok"
  });
});

test("mapping: title strips prefix, keeps first line, marks completed", () => {
  assert.equal(mapping.eventTitle(sampleTask(), { taskPrefix: "Termin:" }), "Erstgespräch ProMinent");
  assert.equal(mapping.eventTitle(sampleTask()), "Termin: Erstgespräch ProMinent");
  assert.equal(mapping.eventTitle(sampleTask({ is_completed: true }), { taskPrefix: "Termin:" }), "✓ Erstgespräch ProMinent");
  assert.equal(mapping.eventTitle(sampleTask({ content_plaintext: "" })), "Attio Termin");
});

test("mapping: date-only deadline becomes all-day, timestamp becomes timed block", () => {
  const opts = { timeZone: "Europe/Berlin", durationMinutes: 45, allDayIfNoTime: true };
  assert.deepEqual(mapping.eventTimes("2026-09-30", opts), { start: { date: "2026-09-30" }, end: { date: "2026-10-01" } });
  assert.deepEqual(mapping.eventTimes("2026-09-10T08:00:00.000000000Z", opts), {
    start: { dateTime: "2026-09-10T08:00:00.000Z", timeZone: "Europe/Berlin" },
    end: { dateTime: "2026-09-10T08:45:00.000Z", timeZone: "Europe/Berlin" }
  });
  const fixed = mapping.eventTimes("2026-09-30", { ...opts, allDayIfNoTime: false, durationMinutes: 60 });
  assert.deepEqual(fixed, {
    start: { dateTime: "2026-09-30T09:00:00", timeZone: "Europe/Berlin" },
    end: { dateTime: "2026-09-30T10:00:00", timeZone: "Europe/Berlin" }
  });
  assert.throws(() => mapping.eventTimes("gestern", opts));
});

test("mapping: event body carries description, source and private properties", () => {
  const event = mapping.buildEvent(
    sampleTask(),
    {
      assignees: [{ name: "André Feigenbutz", email: "andre@vornac.com" }],
      records: [{ name: "ProMinent GmbH", url: "https://app.attio.com/vornac/company/x" }],
      taskUrl: "https://app.attio.com/vornac/tasks"
    },
    { taskPrefix: "Termin:", timeZone: "Europe/Berlin", durationMinutes: 60, allDayIfNoTime: true, attendees: ["andre@vornac.com"] }
  );
  assert.equal(event.id, mapping.eventIdForTask(TASK_ID));
  assert.equal(event.summary, "Erstgespräch ProMinent");
  assert.match(event.description, /ProMinent GmbH \(https:\/\/app\.attio\.com\/vornac\/company\/x\)/);
  assert.match(event.description, /Verantwortlich: André Feigenbutz/);
  assert.match(event.description, new RegExp(`Quelle: Attio Task ${TASK_ID}`));
  assert.equal(event.extendedProperties.private.attioTaskId, TASK_ID);
  assert.deepEqual(event.attendees, [{ email: "andre@vornac.com" }]);
  assert.equal(event.source.title, "Attio");
});

test("config: validation and defaults", () => {
  const config = loadConfig(baseEnv());
  assert.equal(config.google.timeZone, "Europe/Berlin");
  assert.equal(config.google.durationMinutes, 60);
  assert.equal(config.attio.completedTasks, "keep");
  assert.equal(config.google.serviceAccount.client_email, SERVICE_ACCOUNT.client_email);
  assert.doesNotThrow(() => assertRuntimeConfig(config));

  assert.throws(() => assertRuntimeConfig(loadConfig(baseEnv({ GOOGLE_CALENDAR_ID: "" }))), /GOOGLE_CALENDAR_ID/);
  assert.doesNotThrow(() =>
    assertRuntimeConfig(loadConfig(baseEnv({ GOOGLE_CALENDAR_ID: "", GOOGLE_IMPERSONATE_USER: "andre@vornac.com" })))
  );
  assert.throws(() => loadConfig(baseEnv({ ATTIO_COMPLETED_TASKS: "archive" })), /ATTIO_COMPLETED_TASKS/);
  assert.throws(() => loadConfig(baseEnv({ EVENT_DURATION_MINUTES: "-5" })), /EVENT_DURATION_MINUTES/);
  assert.throws(() => loadConfig(baseEnv({ GOOGLE_SERVICE_ACCOUNT_JSON: "{}" })), /client_email/);
  // base64-kodierte Variante wird akzeptiert
  const b64 = Buffer.from(JSON.stringify(SERVICE_ACCOUNT)).toString("base64");
  assert.equal(loadConfig(baseEnv({ GOOGLE_SERVICE_ACCOUNT_JSON: b64 })).google.serviceAccount.client_email, SERVICE_ACCOUNT.client_email);
});

test("google: JWT is RS256-signed with expected claims", () => {
  const jwt = buildJwt(SERVICE_ACCOUNT, { subject: "andre@vornac.com", tokenUrl: "https://oauth2.googleapis.com/token", now: 1000 });
  const [h, p, s] = jwt.split(".");
  const header = JSON.parse(Buffer.from(h, "base64url").toString());
  const claims = JSON.parse(Buffer.from(p, "base64url").toString());
  assert.deepEqual(header, { alg: "RS256", typ: "JWT" });
  assert.equal(claims.iss, SERVICE_ACCOUNT.client_email);
  assert.equal(claims.sub, "andre@vornac.com");
  assert.equal(claims.scope, "https://www.googleapis.com/auth/calendar.events");
  assert.equal(claims.exp - claims.iat, 3600);
  const ok = crypto.verify("RSA-SHA256", Buffer.from(`${h}.${p}`), SERVICE_ACCOUNT.private_key, Buffer.from(s, "base64url"));
  assert.equal(ok, true);
});

/** Gemeinsamer Fake fuer Attio und Google, protokolliert alle Aufrufe. */
function createFakeBackend({ existingEvent = null, task = sampleTask(), attioTaskStatus = 200 } = {}) {
  const calls = [];
  const jsonResponse = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
    json: async () => body
  });
  const fetchImpl = async (url, init = {}) => {
    const method = init.method || "GET";
    const u = new URL(url);
    const isJson = init.headers && init.headers["Content-Type"] === "application/json";
    calls.push({ method, url: u.pathname + u.search, body: isJson && init.body ? JSON.parse(init.body) : init.body, headers: init.headers });

    if (u.hostname === "oauth2.googleapis.com") {
      return jsonResponse(200, { access_token: "ya29.test", expires_in: 3600 });
    }
    if (u.hostname === "api.attio.com") {
      assert.equal(init.headers.Authorization, "Bearer attio-token");
      if (u.pathname === `/v2/tasks/${TASK_ID}`) {
        return attioTaskStatus === 200 ? jsonResponse(200, { data: task }) : jsonResponse(attioTaskStatus, { code: "not_found" });
      }
      if (u.pathname === `/v2/workspace_members/${MEMBER_ID}`) {
        return jsonResponse(200, { data: { first_name: "André", last_name: "Feigenbutz", email_address: "andre@vornac.com" } });
      }
      if (u.pathname === `/v2/objects/${COMPANY_OBJECT}/records/${COMPANY_ID}`) {
        return jsonResponse(200, {
          data: { web_url: "https://app.attio.com/vornac/company/abc", values: { name: [{ value: "ProMinent GmbH" }] } }
        });
      }
      return jsonResponse(404, { code: "not_found" });
    }
    if (u.hostname === "www.googleapis.com") {
      assert.equal(init.headers.Authorization, "Bearer ya29.test");
      const eventPath = /\/calendars\/([^/]+)\/events\/([^/?]+)$/.exec(u.pathname);
      if (method === "GET" && eventPath) {
        return existingEvent ? jsonResponse(200, existingEvent) : jsonResponse(404, { error: { message: "Not Found" } });
      }
      if (method === "POST") return jsonResponse(200, { ...init.body, id: JSON.parse(init.body).id });
      if (method === "PATCH") return jsonResponse(200, JSON.parse(init.body));
      if (method === "DELETE") return existingEvent ? { ok: true, status: 204, text: async () => "", json: async () => null } : jsonResponse(410, {});
    }
    throw new Error(`Unerwarteter Aufruf ${method} ${url}`);
  };
  return { fetchImpl, calls };
}

function buildSyncer(env, backend) {
  const config = loadConfig(baseEnv(env));
  const attio = createAttioClient(config.attio, backend.fetchImpl);
  const google = createGoogleCalendarClient(config.google, backend.fetchImpl);
  const quiet = { warn() {}, error() {}, log() {} };
  return { config, syncer: createSyncer({ config, attio, google, log: quiet }) };
}

test("sync: task.created inserts an event with resolved context", async () => {
  const backend = createFakeBackend();
  const { syncer } = buildSyncer({ ATTIO_TASK_PREFIX: "Termin:" }, backend);
  const results = await syncer.handleWebhookPayload({
    webhook_id: "wh",
    events: [{ event_type: "task.created", id: { workspace_id: "ws", task_id: TASK_ID }, actor: {} }]
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].action, "created");
  assert.equal(results[0].calendarId, "team@group.calendar.google.com");

  const insert = backend.calls.find((c) => c.method === "POST" && c.url.includes("/events"));
  assert.ok(insert, "Insert wurde aufgerufen");
  assert.equal(insert.url, "/calendar/v3/calendars/team%40group.calendar.google.com/events?sendUpdates=none");
  assert.equal(insert.body.summary, "Erstgespräch ProMinent");
  assert.equal(insert.body.id, mapping.eventIdForTask(TASK_ID));
  assert.match(insert.body.description, /ProMinent GmbH \(https:\/\/app\.attio\.com\/vornac\/company\/abc\)/);
  assert.match(insert.body.description, /Verantwortlich: André Feigenbutz/);
  // Ohne Delegation keine Teilnehmer, sonst lehnt Google ab.
  assert.equal(insert.body.attendees, undefined);
  assert.deepEqual(insert.body.start, { dateTime: "2026-09-10T08:00:00.000Z", timeZone: "Europe/Berlin" });
});

test("sync: task.updated patches an existing event, duplicates in one batch collapse", async () => {
  const backend = createFakeBackend({ existingEvent: { id: mapping.eventIdForTask(TASK_ID), status: "confirmed" } });
  const { syncer } = buildSyncer({}, backend);
  const results = await syncer.handleWebhookPayload({
    events: [
      { event_type: "task.created", id: { task_id: TASK_ID } },
      { event_type: "task.updated", id: { task_id: TASK_ID } },
      { event_type: "record.updated", id: { record_id: "x" } }
    ]
  });
  assert.equal(results.filter((r) => r.action === "updated").length, 1);
  assert.equal(results.filter((r) => r.action === "ignored").length, 1);
  const patches = backend.calls.filter((c) => c.method === "PATCH");
  assert.equal(patches.length, 1);
  assert.equal(patches[0].body.id, undefined, "id nicht im Patch-Body");
  assert.equal(patches[0].body.status, "confirmed");
  assert.equal(patches[0].body.summary, "Termin: Erstgespräch ProMinent");
});

test("sync: removing the deadline deletes the event", async () => {
  const backend = createFakeBackend({
    existingEvent: { id: mapping.eventIdForTask(TASK_ID) },
    task: sampleTask({ deadline_at: null })
  });
  const { syncer } = buildSyncer({}, backend);
  const [result] = await syncer.handleWebhookPayload({ events: [{ event_type: "task.updated", id: { task_id: TASK_ID } }] });
  assert.equal(result.action, "deleted");
  assert.equal(result.reason, "no-deadline");
  assert.ok(backend.calls.some((c) => c.method === "DELETE"));
});

test("sync: task.deleted removes the event without calling Attio", async () => {
  const backend = createFakeBackend({ existingEvent: { id: mapping.eventIdForTask(TASK_ID) } });
  const { syncer } = buildSyncer({}, backend);
  const [result] = await syncer.handleWebhookPayload({ events: [{ event_type: "task.deleted", id: { task_id: TASK_ID } }] });
  assert.equal(result.action, "deleted");
  assert.equal(backend.calls.filter((c) => c.url.startsWith("/v2/")).length, 0);
});

test("sync: vanished task (404) is tolerated, missing event reported", async () => {
  const backend = createFakeBackend({ attioTaskStatus: 404 });
  const { syncer } = buildSyncer({}, backend);
  const [result] = await syncer.handleWebhookPayload({ events: [{ event_type: "task.updated", id: { task_id: TASK_ID } }] });
  assert.equal(result.action, "not-found");
  assert.equal(result.reason, "task-missing");
});

test("sync: delegation mode impersonates the assignee and invites allowed domains", async () => {
  const backend = createFakeBackend();
  const { syncer } = buildSyncer(
    { GOOGLE_CALENDAR_ID: "", GOOGLE_IMPERSONATE_USER: "assignee", EVENT_ATTENDEE_DOMAINS: "vornac.com" },
    backend
  );
  const [result] = await syncer.handleWebhookPayload({ events: [{ event_type: "task.created", id: { task_id: TASK_ID } }] });
  assert.equal(result.action, "created");
  assert.equal(result.calendarId, "primary");
  const tokenCall = backend.calls.find((c) => c.url.startsWith("/token"));
  const assertion = new URLSearchParams(tokenCall.body).get("assertion");
  const claims = JSON.parse(Buffer.from(assertion.split(".")[1], "base64url").toString());
  assert.equal(claims.sub, "andre@vornac.com");
  const insert = backend.calls.find((c) => c.method === "POST" && c.url.includes("/events"));
  assert.deepEqual(insert.body.attendees, [{ email: "andre@vornac.com" }]);
  assert.equal(insert.url, "/calendar/v3/calendars/primary/events?sendUpdates=none");
});

test("sync: errors surface per event and do not abort the batch", async () => {
  const backend = createFakeBackend();
  const failing = async (url, init) => {
    if (String(url).includes("/events") && (init.method || "GET") === "POST") {
      return { ok: false, status: 500, text: async () => JSON.stringify({ error: { message: "boom" } }), json: async () => ({}) };
    }
    return backend.fetchImpl(url, init);
  };
  const config = loadConfig(baseEnv());
  const syncer = createSyncer({
    config,
    attio: createAttioClient(config.attio, failing),
    google: createGoogleCalendarClient(config.google, failing),
    log: { warn() {}, error() {}, log() {} }
  });
  const results = await syncer.handleWebhookPayload({
    events: [
      { event_type: "task.created", id: { task_id: TASK_ID } },
      { event_type: "task.deleted", id: { task_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" } }
    ]
  });
  assert.equal(results[0].action, "error");
  assert.match(results[0].error, /boom/);
  assert.equal(results[1].action, "not-found");
});

/** Fake fuer Vercel req/res, um den Handler komplett zu treiben. */
function fakeRequest({ method, body, headers = {} }) {
  const req = new EventEmitter();
  req.method = method;
  req.headers = headers;
  process.nextTick(() => {
    if (body !== undefined) req.emit("data", Buffer.from(body));
    req.emit("end");
  });
  return req;
}
function fakeResponse() {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.setHeader = (k, v) => (res.headers[k] = v);
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (payload) => ((res.body = payload), res);
  return res;
}

test("handler: rejects bad signature, answers health check, processes signed payload", async () => {
  const backend = createFakeBackend();
  const realFetch = globalThis.fetch;
  const env = baseEnv();
  const savedEnv = {};
  for (const [k, v] of Object.entries(env)) {
    savedEnv[k] = process.env[k];
    process.env[k] = v;
  }
  globalThis.fetch = backend.fetchImpl;
  const handlerPath = require.resolve("../api/attio-calendar-webhook");
  delete require.cache[handlerPath];
  const handler = require(handlerPath);
  try {
    assert.deepEqual(handler.config, { api: { bodyParser: false } });

    const health = fakeResponse();
    await handler(fakeRequest({ method: "GET" }), health);
    assert.equal(health.statusCode, 200);
    assert.equal(health.body.ok, true);

    const payload = JSON.stringify({ webhook_id: "wh", events: [{ event_type: "task.created", id: { task_id: TASK_ID } }] });

    const unsigned = fakeResponse();
    await handler(fakeRequest({ method: "POST", body: payload, headers: { "attio-signature": "deadbeef" } }), unsigned);
    assert.equal(unsigned.statusCode, 401);
    assert.equal(backend.calls.length, 0, "keine Aufrufe ohne gueltige Signatur");

    const signed = fakeResponse();
    await handler(
      fakeRequest({ method: "POST", body: payload, headers: { "attio-signature": computeSignature(payload, "whsec") } }),
      signed
    );
    assert.equal(signed.statusCode, 200);
    assert.equal(signed.body.ok, true);
    assert.equal(signed.body.results[0].action, "created");

    const wrongMethod = fakeResponse();
    await handler(fakeRequest({ method: "PUT" }), wrongMethod);
    assert.equal(wrongMethod.statusCode, 405);
  } finally {
    globalThis.fetch = realFetch;
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    delete require.cache[handlerPath];
  }
});
