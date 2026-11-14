# claude-plugins (Adler-Schiffe)

Marketplace `adler-schiffe` mit dem Plugin `adler`. Das Plugin verbindet Claude Code mit der Adler-Plattform (MCP-Endpunkt `https://platform.app.adler-schiffe.de/mcp`) und bringt Anleitungen (Skills) für Kollegen mit.

## Installation für Kollegen

Die Schritt-für-Schritt-Anleitung steht im Handbuch: <https://platform.app.adler-schiffe.de/guide#einrichtung>. Kurz:

1. Token erzeugen: <https://platform.app.adler-schiffe.de/tokens> (Login mit Authentik, Gruppe `platform_developer`). Er wird nur einmal angezeigt.
2. In Claude Code:
   ```text
   /plugin marketplace add adler-schiffe/claude-plugins
   /plugin install adler@adler-schiffe
   ```
   Claude Code fragt nach dem **MCP-Token** (verdecktes Feld): einfügen, Enter. Der Token liegt danach im sicheren Speicher des Betriebssystems, nicht in einer Datei.
3. Claude Code neu starten (`/exit`, dann `claude`) und sagen: „Richte mich für die Adler-Plattform ein.“ Der Skill `adler-onboarding` installiert Git, GitHub CLI, Bun und Docker, verbindet GitHub und prüft die MCP-Verbindung.

Token ersetzen (verloren, gelöscht, 401): neuen Token unter `/tokens` erzeugen, in Claude Code `/plugin configure adler@adler-schiffe` tippen und einfügen. Den Token nie in den Chat kopieren, nie teilen oder in ein Repo schreiben.

## Inhalt

- `.claude-plugin/marketplace.json`: Marketplace-Katalog
- `plugins/adler/.mcp.json`: HTTP-MCP-Server `adler`, Token aus der Plugin-Einstellung `mcp_token` (`userConfig` in `plugin.json`)
- `plugins/adler/skills/`: `adler-onboarding`, `adler-neue-app`, `adler-aenderung-ausliefern`, `adler-problem`

## Test

```sh
bun test
claude plugin validate plugins/adler
```

## Version

`version` in `plugins/adler/.claude-plugin/plugin.json` bei jeder Änderung am Plugin erhöhen (SemVer). Claude Code erkennt Updates an der Version; ohne Erhöhung bekommen Kollegen die Änderung nicht.

## Hinweis an Felix: Sichtbarkeit des Repos

Die Org-Basisrechte sind „No permission“. Kollegen können dieses Repo nur hinzufügen, wenn sie es lesen dürfen. Entweder das Repo öffentlich machen (es enthält keine Secrets, nur den Token-Platzhalter `${user_config.mcp_token}`) oder dem Kollegen-Team Lesezugriff geben.

## Hinweis an Felix: Schutz von `main`

Jeder Push auf `main` erreicht beim nächsten Plugin-Update alle Kollegen. Deshalb bekommt das Repo die Custom Property `platform = true`, damit die Org-Rulesets greifen: `platform-main` (Änderungen nur per PR mit deinem Approve, `.github/CODEOWNERS` nennt `@FelixGaebler`) und `platform-workflows` (Workflows und CODEOWNERS gesperrt; als Push-Ruleset greift es laut GitHub-Doku nur in privaten oder internen Repos). Siehe `docs/setup.md` in `adler-schiffe/adler-platform`, Schritt 1.7.
