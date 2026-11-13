---
name: adler-problem
description: Klärt Probleme mit einer App auf der Adler-Plattform mit app_status und app_logs, versucht selbst eine Lösung und eröffnet sonst eine Hilfe-Anfrage an Felix (hilfe_anfordern, Antworten mit hilfe_antworten). Verwenden, wenn eine App nicht läuft oder sich falsch verhält, z. B. „geht nicht“, „funktioniert nicht“, „Fehler“, „App startet nicht“, „503“, „Anmeldung geht nicht“, „wartet auf Schlüssel“, „Felix fragen“, „Hilfe“, „hat Felix geantwortet?“.
---

# Problem mit einer App klären

Erst nachsehen, dann erklären, dann selbst lösen. Erst wenn das nicht klappt, Hilfe bei Felix anfragen, immer über `hilfe_anfordern`. Erkläre dem Kollegen in einfachen Worten, was du findest.

Welche App? Wenn unklar: `meine_apps` aufrufen (keine Eingabe) und nachfragen. Scheitern die Werkzeuge mit 401 oder fehlen sie: Skill `adler-onboarding`.

## 1. Status

Werkzeug `app_status` mit `app` = App-Name. Die Antwort zeigt Plattform-Status (`DatenbankBereit`, `SSOBereit`, `SecretBereit`, `Konflikt`), fehlende Schlüssel, Release mit Version, Pods mit Neustarts und letzte Events.

## 2. Logs

Werkzeug `app_logs` mit:

- `app`: App-Name
- `zeitraum`: `15m`, `1h` (Standard), `6h` oder `24h`. Mit `1h` beginnen, bei Bedarf größer.
- `suchtext` (optional, höchstens 200 Zeichen): z. B. `error`, `migrate` oder ein Teil der Fehlermeldung.

Secret-Werte sind in den Logs schon durch `***` ersetzt. Versuche nie, sie herauszufinden.

## 3. Typische Fälle

| Was du siehst | Bedeutung | Was tun |
|---|---|---|
| Release „noch nicht deployt“, keine Version, keine Pods | Normal vor dem ersten Release. Ein neues Repo hat nur den „Initial commit“, der nichts deployt. | Kein Problem. Erste Änderung mit PR-Titel `feat:` oder `fix:` ausliefern (Skill `adler-aenderung-ausliefern`). Kein `hilfe_anfordern`. |
| Plattform-Status „noch nicht bearbeitet“ oder `app_status` meldet, die App gibt es nicht | Felix hat den Cluster-PR noch nicht genehmigt. | Abwarten. Felix sieht den PR im Portal. |
| „wartet auf Schlüssel (…)“ / fehlende Schlüssel | Felix hat den Wert noch nicht eingetragen. | Ist der Schlüssel schon angemeldet: abwarten, Felix trägt ihn ein. Fehlt ein Schlüssel ganz: `schluessel_anfordern` mit `app`, `name` (`[A-Z][A-Z0-9_]*`, nicht reserviert) und `beschreibung`. Nie nach dem Wert fragen. |
| Seite zeigt 503 „Die Anmeldung ist für diese App noch nicht eingerichtet“ | Login (SSO) fehlt. | `app_status` prüfen: Ist `SSOBereit` nicht `True`, `hilfe_anfordern`. Das kann nur Felix lösen. |
| Neue Version startet nicht, Logs zeigen Fehler von `migrate` | Datenbank-Migration fehlgeschlagen. Die alte Version läuft weiter. | `app_logs` mit `suchtext` `migrate` lesen. Meist ein Fehler in der Migration: lokal nachstellen, korrigieren, als `fix:` ausliefern. |
| Pods mit vielen Neustarts, Fehler in den Logs | Fehler im Code oder fehlende Einstellung. | Ursache aus den Logs erklären, lokal nachstellen, Code-Fix über Skill `adler-aenderung-ausliefern`. |
| `Konflikt` ist `True` | Die Plattform hat etwas gefunden, das ihr nicht gehört, und nichts geändert. | `hilfe_anfordern`. Das kann nur Felix lösen. |
| „nicht bereit (DatenbankBereit, …)“ ohne erkennbaren Grund, auch nach einer Weile | Problem auf der Plattform. | `hilfe_anfordern`. |
| „Das ist nicht deine App“ | Die App gehört einem anderen Kollegen. | Nichts tun. Nur der Eigentümer oder Felix kann daran arbeiten. |

## 4. Selbst lösen

Code-Fehler behebst du im Repo der App und lieferst sie mit dem Skill `adler-aenderung-ausliefern` aus. Lokal nachstellen hilft oft (`AGENTS.md` im Repo, Abschnitt „Lokal starten“). Merke dir jeden Versuch und sein Ergebnis.

## 5. Hilfe anfordern

Erst nach erfolglosen eigenen Versuchen oder wenn laut Tabelle nur Felix helfen kann. Werkzeug `hilfe_anfordern` mit:

- `app`: App-Name
- `titel`: kurz und konkret, z. B. „SSOBereit bleibt False“ (höchstens 200 Zeichen)
- `beschreibung`: was nicht geht, seit wann, passende Zeilen aus `app_status` und `app_logs` (ohne Secret-Werte)
- `versucht`: was schon versucht wurde und was dabei herauskam

Das Werkzeug legt ein Issue mit Label `needs-admin` im Repo der App an. Gib dem Kollegen den Link. Felix muss nicht zusätzlich angeschrieben werden.

## 6. Antworten abfragen

Später Werkzeug `hilfe_antworten` mit `app` = App-Name. Es zeigt offene und kürzlich geschlossene Hilfe-Anfragen mit den letzten Kommentaren. Fasse Felix' Antwort für den Kollegen zusammen und setze sie um.

## Nie

- Eine Mail an Felix schreiben oder andere Wege als `hilfe_anfordern` nutzen.
- `ssh`, `kubectl`, `helm` oder `flux` verwenden, auch nicht „nur zum Nachsehen“.
- Secrets oder `.env`-Dateien lesen, Secret-Werte erfragen oder in Chat, Code, Issue oder Commit schreiben.
- Auf `main` pushen oder PRs selbst mergen.
- `hilfe_anfordern` für „noch nicht deployt“ vor dem ersten Release.
