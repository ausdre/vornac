# Attio Termin -> Google Kalender

Stand: 2026-09-06. Autor: VORNAC GmbH, Heidelberg.

Attio kennt kein eigenes Termin-Objekt. Termine werden im VORNAC-Workspace als Tasks mit Deadline gefuehrt. Diese Integration spiegelt jede Attio-Task mit Deadline als Termin in einen Google Kalender. Sie laeuft als Vercel Serverless Function im Website-Projekt und braucht keine Datenbank und keine zusaetzlichen npm-Pakete.

| Attio                              | Google Kalender                                      |
| ---------------------------------- | ---------------------------------------------------- |
| `task.created` mit Deadline        | Termin wird angelegt                                 |
| `task.updated` (Text, Deadline)    | Termin wird aktualisiert                             |
| Deadline entfernt                  | Termin wird geloescht                                |
| Task erledigt                      | Titel bekommt ein Haekchen (oder Loeschung, s. u.)   |
| `task.deleted`                     | Termin wird geloescht                                |
| Deadline nur Datum                 | ganztaegiger Termin                                  |
| Deadline mit Uhrzeit               | Block von 60 Minuten (einstellbar)                   |

Die Richtung ist Attio -> Google. Aenderungen im Kalender fliessen nicht zurueck.

## Bestandteile

| Datei                                      | Zweck                                                        |
| ------------------------------------------ | ------------------------------------------------------------ |
| `api/attio-calendar-webhook.js`            | Webhook-Endpunkt, prueft die Signatur, verarbeitet Events    |
| `lib/attio-calendar/config.js`             | Umgebungsvariablen lesen und validieren                      |
| `lib/attio-calendar/signature.js`          | HMAC-SHA256-Pruefung des Headers `Attio-Signature`           |
| `lib/attio-calendar/attio.js`              | Attio-REST-Client (Tasks, Mitglieder, Records)               |
| `lib/attio-calendar/google.js`             | Service-Account-Auth per JWT, Calendar-API-Aufrufe           |
| `lib/attio-calendar/mapping.js`            | Task -> Event (Titel, Zeiten, Beschreibung, Event-ID)        |
| `lib/attio-calendar/sync.js`               | Ablauf: anlegen, aktualisieren, loeschen                     |
| `scripts/attio-calendar-backfill.js`       | Einmaliger Abgleich aller offenen Tasks                      |
| `test/attio-calendar.test.js`              | Tests, laufen mit `npm test`                                 |
| `.env.example`                             | Vorlage fuer die Umgebungsvariablen                          |

Endpunkt in Production: `https://www.vornac.com/api/attio-calendar-webhook`. Ein `GET` darauf liefert `{"ok":true}` und dient als Erreichbarkeitstest.

## Idempotenz ohne Datenbank

Die Google-Event-ID wird aus der Attio-Task-ID abgeleitet (`attio` plus UUID ohne Bindestriche). Ein zweiter Aufruf fuer dieselbe Task findet das Event ueber diese ID und aktualisiert es, statt ein Duplikat anzulegen. Attio darf Webhooks also beliebig oft wiederholen. Zusaetzlich steht die Task-ID in den privaten `extendedProperties` des Events.

## Einrichtung

### 1. Google Service-Account

1. In der Google Cloud Console ein Projekt waehlen und die Google Calendar API aktivieren.
2. Unter IAM > Dienstkonten ein Dienstkonto anlegen (z. B. `attio-calendar-sync`), einen JSON-Schluessel erzeugen und herunterladen.
3. Zielkalender freigeben: in Google Kalender unter Einstellungen des Kalenders > Fuer bestimmte Personen freigeben die E-Mail-Adresse des Dienstkontos mit der Berechtigung "Aenderungen an Terminen vornehmen" eintragen.
4. Die Kalender-ID notieren (bei einem persoenlichen Kalender die E-Mail-Adresse, bei einem Teamkalender die Adresse mit `@group.calendar.google.com`).

Dieser Modus braucht keinen Workspace-Admin. Teilnehmer koennen darin nicht eingeladen werden; die Verantwortlichen stehen in der Beschreibung des Termins.

Optional, domain-weite Delegation: Soll die Funktion im Namen eines Nutzers schreiben (Termin im eigenen Hauptkalender, Verantwortliche als Teilnehmer), muss ein Workspace-Admin dem Dienstkonto in der Admin-Konsole unter Sicherheit > API-Steuerung > Domainweite Delegierung den Scope `https://www.googleapis.com/auth/calendar.events` gewaehren. Dann `GOOGLE_IMPERSONATE_USER` setzen (feste Adresse oder `assignee`).

### 2. Attio API-Token

In Attio unter Workspace-Einstellungen > Entwickler einen Access Token mit diesen Scopes anlegen:

| Scope                        | Wozu                                            |
| ---------------------------- | ----------------------------------------------- |
| `task:read`                  | Task nach Webhook-Event nachladen               |
| `record_permission:read`     | verknuepfte Firmen, Personen, Deals lesen       |
| `object_configuration:read`  | Objekt-IDs aufloesen                            |
| `user_management:read`       | Verantwortliche (Name, E-Mail) aufloesen        |

### 3. Umgebungsvariablen in Vercel

Projekt `vornac`, Team `vornacs-projects`, Settings > Environment Variables. Vorlage: `.env.example`.

| Variable                       | Pflicht | Bedeutung                                                              |
| ------------------------------ | ------- | ---------------------------------------------------------------------- |
| `ATTIO_API_TOKEN`              | ja      | Token aus Schritt 2                                                    |
| `ATTIO_WEBHOOK_SECRET`         | ja      | Secret des Webhooks aus Schritt 4                                      |
| `GOOGLE_SERVICE_ACCOUNT_JSON`  | ja      | kompletter Inhalt der JSON-Schluesseldatei                             |
| `GOOGLE_CALENDAR_ID`           | ja*     | Zielkalender; *entfaellt nur bei Delegation mit `primary`              |
| `GOOGLE_IMPERSONATE_USER`      | nein    | Delegationsmodus: Nutzeradresse oder `assignee`                        |
| `EVENT_ATTENDEE_DOMAINS`       | nein    | nur mit Delegation: Domains, die als Teilnehmer eingetragen werden     |
| `ATTIO_TASK_PREFIX`            | nein    | nur Tasks mit diesem Textanfang spiegeln, z. B. `Termin:`              |
| `ATTIO_COMPLETED_TASKS`        | nein    | `keep` (Standard) oder `delete`                                        |
| `EVENT_TIMEZONE`               | nein    | Standard `Europe/Berlin`                                               |
| `EVENT_DURATION_MINUTES`       | nein    | Standard `60`                                                          |
| `EVENT_ALL_DAY_WITHOUT_TIME`   | nein    | Standard `true`; `false` legt 09:00 Uhr als Beginn fest                |

Nach dem Setzen der Variablen einmal neu deployen, damit die Funktion sie sieht.

### 4. Webhook in Attio anlegen

Attio > Workspace-Einstellungen > Entwickler > Webhooks > Neuer Webhook:

- URL: `https://www.vornac.com/api/attio-calendar-webhook`
- Events: `task.created`, `task.updated`, `task.deleted`
- Das angezeigte Secret als `ATTIO_WEBHOOK_SECRET` in Vercel hinterlegen.

Alternativ per API:

```bash
curl -X POST https://api.attio.com/v2/webhooks \
  -H "Authorization: Bearer $ATTIO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "target_url": "https://www.vornac.com/api/attio-calendar-webhook",
      "subscriptions": [
        { "event_type": "task.created", "filter": null },
        { "event_type": "task.updated", "filter": null },
        { "event_type": "task.deleted", "filter": null }
      ]
    }
  }'
```

Die Antwort enthaelt das `secret`.

### 5. Bestehende Tasks nachziehen

```bash
vercel env pull .env.local
npm run attio:backfill -- --dry-run   # zeigt, was synchronisiert wuerde
npm run attio:backfill                # schreibt in den Kalender
```

Das Skript nimmt alle offenen Tasks mit Deadline (und ggf. Praefix) und ruft dieselbe Logik wie der Webhook auf.

## Verhalten im Detail

- Titel: erste Zeile des Task-Texts, ein gesetztes Praefix wird entfernt. Erledigte Tasks bekommen `✓ ` vorangestellt.
- Beschreibung: kompletter Task-Text, verknuepfte Attio-Datensaetze mit Link, Verantwortliche, Quelle mit Task-ID.
- Teilnehmer werden nur im Delegationsmodus gesetzt und nur fuer Adressen aus `EVENT_ATTENDEE_DOMAINS`. Kunden werden nie automatisch eingeladen; `sendUpdates=none` unterdrueckt jede Benachrichtigung.
- Ein Batch mit mehreren Events zur selben Task wird einmal verarbeitet, letzter Stand gewinnt.
- Schlaegt ein Event fehl, antwortet die Funktion mit 502, Attio wiederholt den Aufruf. Alle anderen Events des Batches werden trotzdem verarbeitet.
- Ohne gueltige Signatur wird mit 401 abgelehnt, ohne einen einzigen Aufruf nach Attio oder Google.

## Grenzen

- Nur Tasks. Datumsfelder auf Deals (etwa "Erwarteter Abschluss") werden nicht gespiegelt. Eine Erweiterung um `record.updated` mit einem festen Datumsattribut ist in `sync.js` vorgesehen, aber nicht gebaut.
- Keine Rueckrichtung. Verschieben im Kalender aendert die Attio-Deadline nicht; der naechste Attio-Webhook stellt die Attio-Zeit wieder her.
- Ein Kalender pro Konfiguration (ausser `GOOGLE_IMPERSONATE_USER=assignee`).

## Tests

```bash
npm test
```

Die Tests decken Signaturpruefung, Event-ID, Zeitabbildung, Konfiguration, JWT-Signatur, Anlegen, Aktualisieren, Loeschen, Delegation, Fehlerfaelle und den kompletten Handler mit gefaelschtem Attio- und Google-Backend ab.
