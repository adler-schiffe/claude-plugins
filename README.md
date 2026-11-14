# claude-plugins (Adler-Schiffe)

Marketplace `adler-schiffe` mit dem Plugin `adler`. Das Plugin verbindet Claude Code mit der Adler-Plattform (MCP-Endpunkt `https://platform.app.adler-schiffe.de/mcp`) und bringt Anleitungen (Skills) für Kollegen mit.

## Installation für Kollegen

1. Token erzeugen: <https://platform.app.adler-schiffe.de/tokens> (Login mit Authentik, Gruppe `platform_developer`).
2. Token als Umgebungsvariable `ADLER_MCP_TOKEN` setzen, und zwar in einem Editor, nie per `echo` im Terminal (sonst landet er im Verlauf): `~/.zshrc` öffnen (`touch ~/.zshrc && open -e ~/.zshrc`), am Ende die Zeile `export ADLER_MCP_TOKEN=<hier den Token einfügen>` ergänzen (ohne Anführungszeichen), speichern. Terminal neu öffnen und Claude Code neu starten, damit es die Variable sieht. Den Token nie anzeigen, nie in den Chat kopieren, nie teilen oder in ein Repo schreiben. Ist er doch irgendwo gelandet: unter `/tokens` löschen und neu erzeugen. Der Skill `adler-onboarding` führt genauso durch.
3. In Claude Code:
   ```text
   /plugin marketplace add adler-schiffe/claude-plugins
   /plugin install adler@adler-schiffe
   ```
4. Mit `/mcp` prüfen, dass `plugin:adler:adler` verbunden ist.

Ist die Variable nicht gesetzt, schlägt die Verbindung fehl (401). Der Skill `adler-onboarding` hilft dann weiter.

## Inhalt

- `.claude-plugin/marketplace.json`: Marketplace-Katalog
- `plugins/adler/.mcp.json`: HTTP-MCP-Server `adler`, Token aus `ADLER_MCP_TOKEN`
- `plugins/adler/skills/`: `adler-onboarding`, `adler-neue-app`, `adler-aenderung-ausliefern`, `adler-problem`

## Test

```sh
bun test
```

## Hinweis an Felix: Sichtbarkeit des Repos

Die Org-Basisrechte sind „No permission“. Kollegen können dieses Repo nur hinzufügen, wenn sie es lesen dürfen. Entweder das Repo öffentlich machen (es enthält keine Secrets, nur den Token-Platzhalter `${ADLER_MCP_TOKEN}`) oder dem Kollegen-Team Lesezugriff geben.

## Hinweis an Felix: Schutz von `main`

Jeder Push auf `main` erreicht beim nächsten Plugin-Update alle Kollegen. Deshalb bekommt das Repo die Custom Property `platform = true`, damit die Org-Rulesets greifen: `platform-main` (Änderungen nur per PR mit deinem Approve, `.github/CODEOWNERS` nennt `@FelixGaebler`) und `platform-workflows` (Workflows und CODEOWNERS gesperrt; als Push-Ruleset greift es laut GitHub-Doku nur in privaten oder internen Repos). Siehe `docs/setup.md` in `adler-schiffe/adler-platform`, Schritt 1.7.
