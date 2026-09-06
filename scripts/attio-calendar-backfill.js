#!/usr/bin/env node
"use strict";

/**
 * Einmaliger Abgleich: alle offenen Attio-Tasks mit Deadline in den Kalender
 * schreiben. Nutzt dieselbe Logik wie der Webhook, deshalb idempotent.
 *
 *   node scripts/attio-calendar-backfill.js            # schreibt
 *   node scripts/attio-calendar-backfill.js --dry-run  # zeigt nur
 *
 * Umgebungsvariablen wie in .env.example (z. B. via `vercel env pull`).
 */

const path = require("node:path");
const fs = require("node:fs");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || process.env[m[1]] !== undefined) continue;
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[m[1]] = value;
  }
}

loadDotEnv(path.join(__dirname, "..", ".env.local"));
loadDotEnv(path.join(__dirname, "..", ".env"));

const { loadConfig, assertRuntimeConfig } = require("../lib/attio-calendar/config");
const { createAttioClient } = require("../lib/attio-calendar/attio");
const { createGoogleCalendarClient } = require("../lib/attio-calendar/google");
const { createSyncer } = require("../lib/attio-calendar/sync");
const { classifyTask, taskContent } = require("../lib/attio-calendar/mapping");

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const config = loadConfig();
  if (!config.attio.apiToken) throw new Error("ATTIO_API_TOKEN fehlt");
  if (!dryRun) assertRuntimeConfig(config);

  const attio = createAttioClient(config.attio);
  const tasks = await attio.listOpenTasks();
  const relevant = tasks.filter((t) => classifyTask(t, config.attio).sync);
  console.log(`${tasks.length} offene Tasks, davon ${relevant.length} mit Deadline${config.attio.taskPrefix ? ` und Praefix "${config.attio.taskPrefix}"` : ""}.`);

  if (dryRun) {
    for (const t of relevant) {
      console.log(`  ${t.deadline_at}  ${taskContent(t).split(/\r?\n/)[0]}`);
    }
    return;
  }

  const google = createGoogleCalendarClient(config.google);
  const syncer = createSyncer({ config, attio, google, log: console });
  const summary = { created: 0, updated: 0, skipped: 0, error: 0 };
  for (const task of relevant) {
    const taskId = task.id.task_id;
    try {
      const result = await syncer.syncTaskById(taskId, { task });
      summary[result.action] = (summary[result.action] || 0) + 1;
      console.log(`  ${result.action.padEnd(8)} ${task.deadline_at}  ${taskContent(task).split(/\r?\n/)[0]}`);
    } catch (err) {
      summary.error += 1;
      console.error(`  error    ${taskId}: ${err.message}`);
    }
  }
  console.log(JSON.stringify(summary));
  if (summary.error) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
