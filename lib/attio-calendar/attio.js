"use strict";

/**
 * Minimaler Attio-REST-Client (nur das, was die Kalender-Synchronisation braucht).
 * Benoetigte Token-Scopes: task:read, record_permission:read,
 * object_configuration:read, user_management:read.
 */

class AttioApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "AttioApiError";
    this.status = status;
    this.body = body;
  }
}

function createAttioClient({ apiToken, baseUrl = "https://api.attio.com" }, fetchImpl = globalThis.fetch) {
  if (!apiToken) throw new Error("ATTIO_API_TOKEN fehlt");

  async function request(path) {
    const res = await fetchImpl(`${baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json"
      }
    });
    const text = await res.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (_) {
      body = text;
    }
    if (!res.ok) {
      throw new AttioApiError(`Attio ${path} antwortete mit ${res.status}`, res.status, body);
    }
    return body;
  }

  const memberCache = new Map();

  return {
    async getTask(taskId) {
      try {
        const body = await request(`/v2/tasks/${encodeURIComponent(taskId)}`);
        return body && body.data ? body.data : null;
      } catch (err) {
        if (err instanceof AttioApiError && err.status === 404) return null;
        throw err;
      }
    },

    async listOpenTasks() {
      const tasks = [];
      const pageSize = 500;
      let offset = 0;
      for (;;) {
        const body = await request(`/v2/tasks?is_completed=false&limit=${pageSize}&offset=${offset}`);
        const page = (body && body.data) || [];
        tasks.push(...page);
        if (page.length < pageSize) break;
        offset += pageSize;
      }
      return tasks;
    },

    async getWorkspaceMember(memberId) {
      if (memberCache.has(memberId)) return memberCache.get(memberId);
      let member = null;
      try {
        const body = await request(`/v2/workspace_members/${encodeURIComponent(memberId)}`);
        member = body && body.data ? body.data : null;
      } catch (err) {
        if (!(err instanceof AttioApiError && (err.status === 404 || err.status === 403))) throw err;
      }
      memberCache.set(memberId, member);
      return member;
    },

    async getRecord(objectIdOrSlug, recordId) {
      try {
        const body = await request(
          `/v2/objects/${encodeURIComponent(objectIdOrSlug)}/records/${encodeURIComponent(recordId)}`
        );
        return body && body.data ? body.data : null;
      } catch (err) {
        if (err instanceof AttioApiError && (err.status === 404 || err.status === 403)) return null;
        throw err;
      }
    }
  };
}

/** Anzeigename eines Attio-Records (Company, Person, Deal) aus den values. */
function recordDisplayName(record) {
  if (!record || !record.values) return null;
  const nameValues = record.values.name;
  if (Array.isArray(nameValues) && nameValues.length) {
    const first = nameValues[0];
    if (typeof first.full_name === "string" && first.full_name.trim()) return first.full_name.trim();
    if (typeof first.value === "string" && first.value.trim()) return first.value.trim();
  }
  return null;
}

/** Erste E-Mail-Adresse eines Person-Records, sonst null. */
function recordPrimaryEmail(record) {
  if (!record || !record.values) return null;
  const emails = record.values.email_addresses;
  if (Array.isArray(emails) && emails.length) {
    const first = emails[0];
    if (typeof first.email_address === "string") return first.email_address.trim().toLowerCase();
  }
  return null;
}

function memberDisplayName(member) {
  if (!member) return null;
  const parts = [member.first_name, member.last_name].filter(Boolean);
  if (parts.length) return parts.join(" ");
  return member.email_address || null;
}

module.exports = {
  createAttioClient,
  AttioApiError,
  recordDisplayName,
  recordPrimaryEmail,
  memberDisplayName
};
