"use strict";

/**
 * Abbildung Attio-Task -> Google-Calendar-Event.
 * Reine Funktionen, ohne Netzwerk. Werden von sync.js und den Tests genutzt.
 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Deterministische Event-ID aus der Task-ID. Google erlaubt fuer Event-IDs
 * die Zeichen 0-9 und a-v (base32hex); eine UUID ohne Bindestriche passt.
 * Dadurch ist jeder Insert idempotent und wir brauchen keine Datenbank.
 */
function eventIdForTask(taskId) {
  const hex = String(taskId).toLowerCase().replace(/-/g, "");
  if (!/^[0-9a-f]{32}$/.test(hex)) {
    throw new Error(`Ungueltige Attio Task-ID: ${taskId}`);
  }
  return `attio${hex}`;
}

/** Task-ID aus einer Event-ID, sonst null. */
function taskIdForEvent(eventId) {
  const m = /^attio([0-9a-f]{32})$/.exec(String(eventId || ""));
  if (!m) return null;
  const h = m[1];
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function taskContent(task) {
  return String(task.content_plaintext || task.content || "").trim();
}

/**
 * Entscheidet, ob eine Task ueberhaupt in den Kalender gehoert.
 * Rueckgabe: { sync: boolean, reason: string }
 */
function classifyTask(task, { taskPrefix = "", completedTasks = "keep" } = {}) {
  if (!task) return { sync: false, reason: "task-missing" };
  if (!task.deadline_at) return { sync: false, reason: "no-deadline" };
  const content = taskContent(task);
  if (taskPrefix && !content.toLowerCase().startsWith(taskPrefix.toLowerCase())) {
    return { sync: false, reason: "prefix-mismatch" };
  }
  if (task.is_completed && completedTasks === "delete") {
    return { sync: false, reason: "completed" };
  }
  return { sync: true, reason: "ok" };
}

/** Titel: Praefix entfernen, Zeilenumbrueche glaetten, Laenge begrenzen. */
function eventTitle(task, { taskPrefix = "" } = {}) {
  let content = taskContent(task);
  if (taskPrefix && content.toLowerCase().startsWith(taskPrefix.toLowerCase())) {
    content = content.slice(taskPrefix.length).trim();
  }
  const firstLine = content.split(/\r?\n/)[0].trim() || "Attio Termin";
  const title = firstLine.length > 200 ? `${firstLine.slice(0, 197)}...` : firstLine;
  return task.is_completed ? `✓ ${title}` : title;
}

/**
 * Start/Ende aus deadline_at. Ein reines Datum wird zum ganztaegigen Termin
 * (wenn allDayIfNoTime), ein Zeitstempel zu einem Block von durationMinutes.
 */
function eventTimes(deadlineAt, { timeZone, durationMinutes, allDayIfNoTime }) {
  const raw = String(deadlineAt).trim();
  if (DATE_ONLY.test(raw)) {
    if (allDayIfNoTime) {
      const end = new Date(`${raw}T00:00:00Z`);
      end.setUTCDate(end.getUTCDate() + 1);
      return { start: { date: raw }, end: { date: end.toISOString().slice(0, 10) } };
    }
    // Ohne Ganztags-Option: 09:00 lokal, Google interpretiert dateTime ohne
    // Offset in der angegebenen Zeitzone.
    const start = `${raw}T09:00:00`;
    const endDate = new Date(`${raw}T09:00:00Z`);
    endDate.setUTCMinutes(endDate.getUTCMinutes() + durationMinutes);
    return {
      start: { dateTime: start, timeZone },
      end: { dateTime: endDate.toISOString().replace(/\.\d{3}Z$/, ""), timeZone }
    };
  }
  const start = new Date(raw);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Unlesbares deadline_at: ${deadlineAt}`);
  }
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return {
    start: { dateTime: start.toISOString(), timeZone },
    end: { dateTime: end.toISOString(), timeZone }
  };
}

/**
 * Beschreibungstext. `context` liefert bereits aufgeloeste Namen:
 *   { assignees: [{name, email}], records: [{name, url, objectSlug}], taskUrl }
 */
function eventDescription(task, context = {}) {
  const lines = [];
  const content = taskContent(task);
  if (content) lines.push(content, "");

  const records = context.records || [];
  if (records.length) {
    lines.push("Verknuepft in Attio:");
    for (const r of records) {
      lines.push(`  ${r.name || r.recordId || "Datensatz"}${r.url ? ` (${r.url})` : ""}`);
    }
    lines.push("");
  }

  const assignees = (context.assignees || []).filter((a) => a && (a.name || a.email));
  if (assignees.length) {
    lines.push(`Verantwortlich: ${assignees.map((a) => a.name || a.email).join(", ")}`);
  }
  if (task.is_completed) lines.push("Status: in Attio erledigt");
  lines.push(`Quelle: Attio Task ${task.id && task.id.task_id ? task.id.task_id : ""}`.trim());
  return lines.join("\n").trim();
}

/**
 * Baut den Event-Body fuer Insert/Patch.
 */
function buildEvent(task, context, options) {
  const taskId = task.id && task.id.task_id ? task.id.task_id : task.task_id;
  const times = eventTimes(task.deadline_at, options);
  const event = {
    id: eventIdForTask(taskId),
    status: "confirmed",
    summary: eventTitle(task, options),
    description: eventDescription(task, context),
    start: times.start,
    end: times.end,
    extendedProperties: {
      private: {
        attioTaskId: taskId,
        attioSyncedAt: new Date().toISOString()
      }
    },
    reminders: { useDefault: true }
  };
  if (context && context.taskUrl) {
    event.source = { title: "Attio", url: context.taskUrl };
  }
  if (options.attendees && options.attendees.length) {
    event.attendees = options.attendees.map((email) => ({ email }));
  }
  return event;
}

module.exports = {
  eventIdForTask,
  taskIdForEvent,
  classifyTask,
  eventTitle,
  eventTimes,
  eventDescription,
  buildEvent,
  taskContent
};
