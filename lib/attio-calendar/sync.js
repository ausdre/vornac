"use strict";

const { recordDisplayName, memberDisplayName } = require("./attio");
const { buildEvent, classifyTask, eventIdForTask } = require("./mapping");

/**
 * Orchestrierung: eine Attio-Task in den Kalender schreiben oder daraus entfernen.
 */

const OBJECT_URL_SEGMENT = { companies: "company", people: "person", deals: "deal" };

async function resolveContext(task, attio, log) {
  const assignees = [];
  for (const a of task.assignees || []) {
    const memberId = a.referenced_actor_id || a.workspace_member_id;
    if (!memberId || (a.referenced_actor_type && a.referenced_actor_type !== "workspace-member")) continue;
    const member = await attio.getWorkspaceMember(memberId).catch((err) => {
      log.warn("Workspace-Mitglied nicht aufloesbar", { memberId, error: err.message });
      return null;
    });
    assignees.push({
      id: memberId,
      name: memberDisplayName(member),
      email: member && member.email_address ? String(member.email_address).toLowerCase() : null
    });
  }

  const records = [];
  for (const link of task.linked_records || []) {
    const objectId = link.target_object_id || link.object_id;
    const recordId = link.target_record_id || link.record_id;
    if (!objectId || !recordId) continue;
    const record = await attio.getRecord(objectId, recordId).catch((err) => {
      log.warn("Record nicht aufloesbar", { objectId, recordId, error: err.message });
      return null;
    });
    records.push({
      objectId,
      recordId,
      name: recordDisplayName(record),
      url: record && record.web_url ? record.web_url : null
    });
  }

  return { assignees, records };
}

function pickAttendees(context, config) {
  // Teilnehmer nur im Delegationsmodus, sonst lehnt Google den Insert ab.
  if (!config.google.impersonateUser) return [];
  const allowed = config.google.attendeeDomains;
  if (!allowed.length) return [];
  const emails = new Set();
  for (const a of context.assignees) {
    if (a.email && allowed.includes(a.email.split("@")[1])) emails.add(a.email);
  }
  return [...emails];
}

function resolveTarget(context, config) {
  let subject = config.google.impersonateUser || null;
  if (subject && subject.toLowerCase() === "assignee") {
    const first = context.assignees.find((a) => a.email);
    subject = first ? first.email : null;
    if (!subject) {
      // Kein Verantwortlicher mit E-Mail: auf festen Kalender ausweichen, falls vorhanden.
      if (!config.google.calendarId) return null;
    }
  }
  const calendarId = config.google.calendarId || (subject ? "primary" : null);
  if (!calendarId) return null;
  return { subject, calendarId };
}

function createSyncer({ config, attio, google, log = console }) {
  const mappingOptions = {
    taskPrefix: config.attio.taskPrefix,
    completedTasks: config.attio.completedTasks,
    timeZone: config.google.timeZone,
    durationMinutes: config.google.durationMinutes,
    allDayIfNoTime: config.google.allDayIfNoTime
  };

  async function removeEvent(taskId, target) {
    const eventId = eventIdForTask(taskId);
    const removed = await google.deleteEvent({ ...target, eventId });
    return removed ? "deleted" : "not-found";
  }

  /**
   * Synchronisiert eine Task anhand ihrer ID. Rueckgabe beschreibt das Ergebnis,
   * damit Webhook-Handler und Backfill-Skript dasselbe Protokoll schreiben.
   */
  async function syncTaskById(taskId, { task: preloaded } = {}) {
    const task = preloaded || (await attio.getTask(taskId));
    if (!task) {
      // Task existiert nicht mehr: Event entfernen, falls ein Ziel bestimmbar ist.
      const target = resolveTarget({ assignees: [] }, config);
      if (!target) return { taskId, action: "skipped", reason: "task-missing-no-target" };
      const action = await removeEvent(taskId, target);
      return { taskId, action, reason: "task-missing" };
    }

    const verdict = classifyTask(task, mappingOptions);
    const context = await resolveContext(task, attio, log);
    const target = resolveTarget(context, config);
    if (!target) return { taskId, action: "skipped", reason: "no-calendar-target" };

    if (!verdict.sync) {
      // Nicht (mehr) kalenderrelevant: ggf. vorhandenes Event entfernen.
      const action = await removeEvent(taskId, target);
      return { taskId, action, reason: verdict.reason };
    }

    const attendees = pickAttendees(context, config);
    const event = buildEvent(task, context, { ...mappingOptions, attendees });
    const existing = await google.getEvent({ ...target, eventId: event.id });

    if (!existing) {
      await google.insertEvent({ ...target, event });
      return { taskId, action: "created", reason: verdict.reason, calendarId: target.calendarId };
    }
    const { id: _ignored, ...patch } = event;
    await google.patchEvent({ ...target, eventId: event.id, event: patch });
    return { taskId, action: "updated", reason: verdict.reason, calendarId: target.calendarId };
  }

  async function deleteTaskById(taskId) {
    const target = resolveTarget({ assignees: [] }, config);
    if (!target) return { taskId, action: "skipped", reason: "no-calendar-target" };
    const action = await removeEvent(taskId, target);
    return { taskId, action, reason: "task-deleted" };
  }

  /** Verarbeitet einen kompletten Webhook-Body von Attio. */
  async function handleWebhookPayload(payload) {
    const events = Array.isArray(payload && payload.events) ? payload.events : [];
    const results = [];
    // Dieselbe Task kann mehrfach im Batch stehen; letzter Stand gewinnt.
    const seen = new Set();
    for (const evt of [...events].reverse()) {
      const type = evt && evt.event_type;
      const taskId = evt && evt.id && evt.id.task_id;
      if (!type || !type.startsWith("task.") || !taskId) {
        results.push({ action: "ignored", reason: "not-a-task-event", eventType: type || null });
        continue;
      }
      if (seen.has(taskId)) continue;
      seen.add(taskId);
      try {
        const result = type === "task.deleted" ? await deleteTaskById(taskId) : await syncTaskById(taskId);
        results.push({ ...result, eventType: type });
      } catch (err) {
        log.error("Synchronisation fehlgeschlagen", { taskId, eventType: type, error: err.message });
        results.push({ taskId, eventType: type, action: "error", error: err.message });
      }
    }
    return results.reverse();
  }

  return { syncTaskById, deleteTaskById, handleWebhookPayload };
}

module.exports = { createSyncer, resolveTarget, pickAttendees };
