---
name: adler-neue-app
description: Meldet eine neue App auf der Adler-Plattform an (Werkzeug app_anmelden), klont das neue Repo und erklärt die nächsten Schritte. Verwenden, wenn ein Kollege eine neue Anwendung bauen will, z. B. „neue App“, „App anlegen“, „App anmelden“, „ich brauche eine Anwendung für …“, „neues Projekt auf der Plattform“.
---

# Neue App anmelden

Eine neue App entsteht nur über das Werkzeug `app_anmelden` des MCP-Servers `adler`. Nie ein Repo von Hand anlegen, kopieren oder forken. Das Werkzeug legt das Repo `adler-schiffe/<name>` aus der Vorlage an, trägt den Kollegen als Collaborator ein und öffnet einen PR im Cluster-Repo. Die Dateien dafür erzeugt das Werkzeug, nicht du.

## 1. Voraussetzung

Rufe `meine_apps` auf (keine Eingabe). Scheitert das (401, Werkzeug fehlt, „Dafür fehlt dir die Berechtigung“), wechsle zum Skill `adler-onboarding`.

## 2. Nachfragen

Frag die Punkte einzeln und in einfachen Worten. Mach Vorschläge, der Kollege entscheidet.

1. **Zweck:** Was soll die App können? Wer benutzt sie? Daraus leitest du die übrigen Vorschläge ab.
2. **Name** (`name`): englisch, kebab-case, nur `a-z`, Ziffern und `-`, beginnt mit einem Buchstaben, endet mit Buchstabe oder Ziffer, 3 bis 40 Zeichen, z. B. `svg-sonderfahrten`. Der Name ist zugleich Repo-Name und Teil der Adresse. Er lässt sich später nicht ändern.
3. **Titel** (`titel`): deutsch, so wie Benutzer die App sehen, höchstens 100 Zeichen, z. B. „Sonderfahrten-Anfragen“.
4. **Rollen** (`rollen`): Gruppen von Benutzern mit unterschiedlichen Rechten. Jede Rolle passt zu `[a-z][a-z0-9_]*` (Kleinbuchstaben, Ziffern, Unterstrich). Empfehlung: Präfix aus dem App-Namen, z. B. `sonderfahrten_buero`, `sonderfahrten_heim`. Ohne Rollen gibt es trotzdem einen Login. Mitglieder trägt Felix später ein.
5. **Datenbank** (`datenbank`): ja oder nein. Ja, sobald die App etwas speichern soll.
6. **Externe Schlüssel** (`schluessel`): Passwörter oder API-Keys anderer Dienste, z. B. für Mailversand. Pro Schlüssel:
   - `name`: `[A-Z][A-Z0-9_]*`, z. B. `SMTP_PASS`
   - `beschreibung`: wofür, 1 bis 500 Zeichen

   Nicht erlaubt (setzt die Plattform selbst): `DATABASE_URL`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `SESSION_SECRET`, `APP_URL`, `PORT`. Frag nie nach dem Wert eines Schlüssels. Den Wert trägt Felix später im Portal ein.
7. **Host** (`host`): Standard ist `<name>.app.adler-schiffe.de`. Nur wenn der Kollege etwas anderes will: Er muss mit dem App-Namen beginnen (`<name>.app.adler-schiffe.de` oder `<name>-….app.adler-schiffe.de`). Beim Standard das Feld weglassen.

Fass alles kurz zusammen und lass es bestätigen.

## 3. Anmelden

Werkzeug `app_anmelden` mit:

| Feld | Pflicht | Inhalt |
|---|---|---|
| `name` | ja | App-Name |
| `titel` | ja | Titel |
| `host` | nein | nur bei abweichendem Host |
| `datenbank` | nein | `true` oder `false` (Standard `false`) |
| `rollen` | nein | Liste, Standard leer |
| `schluessel` | nein | Liste aus `{ "name", "beschreibung" }`, Standard leer |

`fuer_benutzer` nie setzen. Das ist nur für Felix.

Typische Fehler:

- „ist kein Mitglied der GitHub-Organisation adler-schiffe“, „kein gültiger GitHub-Benutzername“ oder „bitte Onboarding bei Felix abschließen“: Onboarding fehlt. Wechsle zum Skill `adler-onboarding`.
- Name reserviert oder schon vergeben: anderen Namen vorschlagen und erneut fragen.
- Host vergeben oder reserviert: Standard-Host nehmen oder anderen vorschlagen.
- „Ungültige Eingabe (…)“: Feld laut Meldung korrigieren.

## 4. Repo klonen

Die Antwort enthält die Repo-URL und die URL des Cluster-PR. Klone das Repo in den Ordner `~/Apps` (legt das Onboarding an; fehlt er, lege ihn an). Die Befehle klappen unter macOS und Windows:

```sh
cd ~/Apps
gh repo clone adler-schiffe/<name>
```

## 5. Erklären, wie es weitergeht

Sag dem Kollegen in einfachen Worten:

1. **Felix muss jetzt den Cluster-PR genehmigen** (Link aus der Antwort). Erst danach legt die Plattform Datenbank, Login und Schlüssel an. Du musst Felix nicht extra Bescheid geben, er sieht den PR im Portal.
2. **Die App läuft erst nach dem ersten Merge, der einen Release auslöst**, also mit PR-Titel und Commit-Nachricht vom Typ `feat:` oder `fix:` (auch `perf`, `refactor`, `revert`). Ein PR mit `docs:` oder `chore:` deployt nichts. Bis dahin zeigt `app_status` „noch nicht deployt“. Das ist normal.
3. Fehlende Schlüssel trägt Felix im Portal ein. Bis dahin meldet `app_status` „wartet auf Schlüssel“.
4. Im neuen Repo zuerst `AGENTS.md` lesen. Dort steht, wie die App aufgebaut ist und wie man lokal startet.
5. Änderungen ausliefern: Skill `adler-aenderung-ausliefern`.

Öffne danach `AGENTS.md` im geklonten Repo und richte dich bei der weiteren Arbeit danach.

## Nie

- Ein App-Repo von Hand anlegen, kopieren oder forken, oder Dateien im Cluster-Repo selbst schreiben.
- Nach Werten von Schlüsseln fragen oder sie in Chat, Code, PR oder Commit schreiben. Secrets oder `.env`-Dateien lesen.
- `ssh`, `kubectl`, `helm` oder `flux` verwenden.
- Auf `main` pushen, PRs selbst mergen.
- Eine Mail an Felix schreiben. Hilfe gibt es über `hilfe_anfordern` (Skill `adler-problem`).
