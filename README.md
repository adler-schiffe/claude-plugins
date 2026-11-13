# claude-plugins (Adler-Schiffe)

Marketplace `adler-schiffe` mit dem Plugin `adler`. Das Plugin verbindet Claude Code mit der Adler-Plattform (MCP-Endpunkt `https://platform.app.adler-schiffe.de/mcp`) und bringt Anleitungen (Skills) für Kollegen mit.

## Installation für Kollegen

1. Token erzeugen: <https://platform.app.adler-schiffe.de/tokens> (Login mit Authentik, Gruppe `adler-entwickler`).
2. Token als Umgebungsvariable `ADLER_MCP_TOKEN` setzen, z. B. in `~/.zshrc`:
   `export ADLER_MCP_TOKEN="<dein Token>"`
   Terminal neu öffnen, damit Claude Code die Variable sieht. Den Token nie teilen oder in ein Repo schreiben.
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
