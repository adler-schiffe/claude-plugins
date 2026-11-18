---
name: adler-aenderung-ausliefern
description: Liefert eine Änderung an einer App auf der Adler-Plattform aus, mit Branch, kleinen Conventional Commits, Prüfungen, Pull Request, Copilot-Kommentaren, Felix' Freigabe und Kontrolle per app_status. Verwenden, wenn eine Änderung fertig ist oder live gehen soll, z. B. „ausliefern“, „veröffentlichen“, „live stellen“, „deployen“, „Pull Request machen“, „PR erstellen“, „hochladen“, „Änderung fertig“.
---

# Änderung ausliefern

Jede Änderung geht über einen Pull Request. Felix genehmigt und mergt. Danach läuft der Release automatisch und Flux deployt die neue Version. Erkläre dem Kollegen jeden Schritt kurz in einfachen Worten.

Gilt im Repo der App (`adler-schiffe/<app>`). Lies dort `AGENTS.md`, falls noch nicht geschehen.

## 1. Branch

Nie direkt auf `main` arbeiten. Vor dem Start:

```sh
git switch main && git pull --rebase
git switch -c feat/<thema>      # neue Funktion
git switch -c fix/<thema>       # Fehlerbehebung
```

`<thema>` englisch, kurz, kebab-case, z. B. `feat/booking-form`.

## 2. Klein committen

Ein Commit pro logischer Änderung, Conventional Commits:

```text
<type>(<scope>)?: <beschreibung im Imperativ, englisch, klein, ohne Punkt>

feat(ui): add booking form
fix(db): handle missing user on login
```

| Type | Löst einen Release aus |
|---|---|
| `feat`, `fix`, `perf`, `refactor`, `revert`, Breaking Change (`!`) | ja |
| `docs`, `chore`, `style`, `test`, `build`, `ci` | nein |

Generierte Dateien in denselben Commit wie ihre Quelle (`contract.json`/`contract.d.ts` zu `contract.prisma`, `bun.lock` zu `package.json`, Migrationen zum Contract). Nie `--no-verify`.

## 3. Prüfen vor dem Push

```sh
bun run lint
bun run typecheck
bun run test
bun run build
```

Alles muss grün sein. Fehler zuerst beheben. Wenn der Kollege Docker laufen hat und die Oberfläche geändert wurde, zusätzlich `bun run test:e2e`.

## 4. Pull Request

```sh
git push -u origin HEAD
gh pr create --reviewer FelixGaebler --title "feat: add booking form" --body "<was und warum, auf Deutsch>"
```

- **Felix ist immer Reviewer** (`--reviewer FelixGaebler`). Gibt es den PR schon ohne ihn: `gh pr edit --add-reviewer FelixGaebler`.

- **Commit-Nachrichten und PR-Titel** müssen Conventional Commits sein, Hook und CI prüfen beides. Beim Squash-Merge nimmt GitHub bei mehreren Commits den PR-Titel als Commit-Nachricht auf `main`, bei einem einzelnen Commit dessen Nachricht. Diese Nachricht entscheidet, ob ein Release entsteht. Für eine Änderung, die live gehen soll: Titel und Commits mit `feat:` oder `fix:`.
- Im Body kurz beschreiben, was sich ändert. Migrationen mit `DROP`, Typänderung oder `NOT NULL` ohne Default begründen. Chart-Änderungen begründen.
- Gib dem Kollegen den Link zum PR.

## 5. Copilot-Kommentare abarbeiten

Copilot reviewt automatisch. Nach ein paar Minuten:

```sh
gh pr view --comments
gh pr checks
```

Jeden Kommentar abarbeiten: beheben, committen, pushen. Oder im PR kurz begründen, warum nicht (`gh pr comment --body "…"`). Fehlgeschlagene Checks ebenso beheben.

## 6. Auf Felix warten

Felix genehmigt und mergt. **Nicht selbst mergen**, auch wenn es technisch ginge. Der Kollege muss Felix nicht extra anschreiben. Stand prüfen:

```sh
gh pr view --json state,reviewDecision
```

Fordert Felix Änderungen an: wie in Schritt 5 abarbeiten und pushen.

## 7. Nach dem Merge prüfen

Der Release dauert einige Minuten (Image bauen, Chart, dann Flux). Danach Werkzeug `app_status` mit `app` = App-Name.

- Unter „Release“ steht die neue Version und „bereit“: fertig. Dem Kollegen die Adresse `https://<host>` nennen.
- Noch die alte Version: ein paar Minuten warten und erneut prüfen. Der Release-Lauf ist in GitHub sichtbar: `gh run list --workflow release.yml --limit 3`.
- Kein Release entstanden: Enthielt der Merge nur `docs`, `chore` oder ähnliches, gibt es absichtlich keinen Release. Das ist kein Fehler.
- Version nicht bereit, Pods mit Neustarts oder Fehler: Skill `adler-problem`.

Danach lokal aufräumen:

```sh
git switch main && git pull --rebase
```

## Nie

- Auf `main` pushen oder committen, Force-Push auf `main`, `--no-verify`.
- PRs selbst mergen oder Felix' Freigabe umgehen.
- Tags oder Releases von Hand anlegen.
- `ssh`, `kubectl`, `helm` oder `flux` verwenden.
- Secrets oder `.env`-Dateien lesen, Secret-Werte in Code, Commit, PR oder Chat schreiben.
- Eine Mail an Felix schreiben. Hilfe gibt es über `hilfe_anfordern` (Skill `adler-problem`).
