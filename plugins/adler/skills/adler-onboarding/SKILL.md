---
name: adler-onboarding
description: Prüft und erklärt die Einrichtung für die Adler-Plattform (GitHub-Login, Org adler-schiffe, Token ADLER_MCP_TOKEN, MCP-Verbindung, Bun, Docker). Verwenden, wenn ein Kollege neu startet oder etwas mit dem Zugang nicht geht, z. B. „einrichten“, „Onboarding“, „ich bin neu“, „MCP geht nicht“, „401“, „Token“, „adler-Werkzeuge fehlen“, „kein Zugriff“, „bitte Onboarding bei Felix abschließen“.
---

# Adler-Plattform einrichten

Du hilfst einem Kollegen, der kein Entwickler ist. Sprich einfach und freundlich. Erkläre jeden fehlenden Schritt in ein, zwei Sätzen. Prüfe der Reihe nach und zeige am Ende eine kurze Liste: was passt, was fehlt, was der Kollege selbst tun kann, was nur Felix kann.

## Ablauf

Stelle zuerst fest, ob der Kollege macOS oder Windows nutzt (deine Umgebung zeigt das an, sonst frag nach). Viele Schritte unterscheiden sich, gib immer nur die Anleitung für sein System. Das Handbuch <https://platform.app.adler-schiffe.de/guide#einrichtung> zeigt beide Varianten.

### 1. GitHub-Login

```sh
gh auth status
```

- Nicht angemeldet oder `gh` fehlt: installieren (macOS: `brew install gh`, Windows: `winget install --id GitHub.cli --source winget`, danach ein neues Terminal-Fenster öffnen), dann `gh auth login` (GitHub.com, HTTPS, im Browser anmelden). Der Kollege macht das selbst im Terminal.
- Nie `--show-token` verwenden.

### 2. Mitglied der Org `adler-schiffe`

```sh
gh api user/memberships/orgs/adler-schiffe --jq .state
```

Gib nur den Status aus, nichts anderes.

- `active`: passt.
- `pending`: Es gibt eine Einladung. Der Kollege nimmt sie unter <https://github.com/orgs/adler-schiffe/invitation> an.
- Fehler 404: kein Mitglied. Das kann nur Felix (Einladung in die Org).
- Fehler 403 wegen fehlender Rechte des Logins: `gh auth refresh -s read:org`, dann erneut prüfen.

### 3. Token `ADLER_MCP_TOKEN` gesetzt?

Prüfe nur, ob die Variable gesetzt ist. Gib den Wert nie aus:

```sh
[ -n "${ADLER_MCP_TOKEN:-}" ] && echo gesetzt || echo fehlt
```

Unter Windows ohne Bash (PowerShell):

```powershell
if ($env:ADLER_MCP_TOKEN) { "gesetzt" } else { "fehlt" }
```

Wichtig: Claude Code liest die Variable beim Start. Fehlt sie dort, schickt Claude Code den Text `${ADLER_MCP_TOKEN}` statt des Tokens, und jeder MCP-Aufruf scheitert mit 401 (nicht angemeldet). Zeigt der Befehl `gesetzt`, aber die Werkzeuge melden trotzdem 401, wurde die Variable meist erst nach dem Start von Claude Code gesetzt. Dann Claude Code beenden und neu starten. Hilft das nicht, ist der Token ungültig oder gelöscht: neuen Token erzeugen (Schritte unten).

Fehlt die Variable, erkläre diese Schritte. Der Kollege macht sie selbst:

1. <https://platform.app.adler-schiffe.de/tokens> im Browser öffnen und mit dem Adler-Login (Authentik) anmelden.
2. Ein Token erzeugen. Es wird genau einmal angezeigt. Es gehört nur dem Kollegen.
   - Meldung „GitHub-Login fehlt in Authentik, bitte Felix fragen“: Das kann nur Felix (Attribut `github` am Benutzer).
   - Kein Zugriff auf die Seite: Die Gruppe `platform_developer` fehlt. Das kann nur Felix.
3. Den Token speichern, ohne dass er im Terminal-Verlauf landet:
   - **macOS:** Die Datei `~/.zshrc` im Editor öffnen:
     ```sh
     touch ~/.zshrc && open -e ~/.zshrc
     ```
     Am Ende eine neue Zeile einfügen und den Token dort selbst einsetzen, ohne Anführungszeichen (TextEdit macht sonst manchmal typografische Anführungszeichen daraus):
     ```text
     export ADLER_MCP_TOKEN=<hier den Token einfügen>
     ```
     Speichern und den Editor schließen.
   - **Windows:** Windows-Taste drücken, „Umgebungsvariablen“ tippen, *Umgebungsvariablen für dieses Konto bearbeiten* öffnen. Unter Benutzervariablen *Neu…* klicken, Name `ADLER_MCP_TOKEN`, als Wert den Token einfügen (ohne Anführungszeichen), zweimal *OK*. Nicht `setx` im Terminal verwenden, sonst steht der Token im Befehlsverlauf.
4. Claude Code beenden, **alle** Terminal-Fenster schließen, ein neues öffnen und `claude` dort neu starten. Dann diesen Skill noch einmal ausführen.

Der Token kommt **nie** in den Chat, in eine Datei im Repo oder in einen Befehl, den du ausführst. Du schreibst ihn auch nicht selbst in `~/.zshrc` oder in die Umgebungsvariablen. Bietet der Kollege an, ihn in den Chat zu kopieren, lehne ab und verweise auf Editor bzw. Umgebungsvariablen. Ist er doch im Chat gelandet: Der Kollege löscht ihn unter `/tokens` und erzeugt einen neuen.

Der Token merkt sich Gruppen und GitHub-Login zum Zeitpunkt der Erstellung. Hat Felix danach etwas geändert (Gruppe `platform_developer`, Attribut `github`), braucht der Kollege einen neuen Token. Den alten Wert dann ersetzen (macOS: in `~/.zshrc` im Editor, Windows: in den Umgebungsvariablen über *Bearbeiten…*).

### 4. MCP-Verbindung

Rufe das Werkzeug `meine_apps` des MCP-Servers `adler` auf (keine Eingabe).

- Antwort ist eine Liste oder „Du hast noch keine Apps.“: Die Verbindung steht.
- 401 oder „nicht angemeldet“: zurück zu Schritt 3.
- „Dafür fehlt dir die Berechtigung (Gruppe platform_developer)“: Das kann nur Felix. Danach braucht der Kollege einen neuen Token.
- Das Werkzeug gibt es gar nicht: Das Plugin `adler` ist nicht installiert oder der Server ist nicht verbunden. Der Kollege prüft in Claude Code mit `/mcp`, ob `plugin:adler:adler` verbunden ist, und sonst mit `/plugin`, ob `adler@adler-schiffe` installiert ist.
- Fehler beim Hinzufügen des Marketplace `adler-schiffe/claude-plugins` (Repo nicht gefunden): Der Kollege hat keinen Lesezugriff auf das Repo. Das kann nur Felix.

### 5. Bun

```sh
bun --version
```

Fehlt Bun, installieren und danach ein neues Terminal öffnen:

- macOS: `curl -fsSL https://bun.sh/install | bash`
- Windows (PowerShell): `powershell -c "irm bun.sh/install.ps1|iex"`

### 6. Docker

```sh
docker info --format '{{.ServerVersion}}'
```

- Fehlt Docker: Docker Desktop installieren (<https://www.docker.com/products/docker-desktop/>). Unter Windows fragt die Installation nach WSL 2: bestätigen und neu starten, wenn Windows danach fragt.
- Docker ist installiert, aber der Befehl scheitert: Docker Desktop starten und warten, bis es läuft.

Docker braucht man nur, um eine App lokal mit Datenbank zu starten.

## Was nur Felix kann

- Einladung in die GitHub-Org `adler-schiffe`
- Gruppe `platform_developer` in Authentik
- Attribut `github` (GitHub-Login) am Authentik-Benutzer
- Lesezugriff auf das Repo `adler-schiffe/claude-plugins`

So meldest du es:

- **MCP geht und der Kollege hat schon eine App** (`meine_apps` zeigt sie): Werkzeug `hilfe_anfordern` mit
  - `app`: Name der App
  - `titel`: z. B. „Onboarding: Attribut github fehlt“
  - `beschreibung`: was fehlt, mit dem GitHub-Login des Kollegen
  - `versucht`: welche Prüfungen gelaufen sind und mit welchem Ergebnis

  Antworten liest der Kollege später mit `hilfe_antworten` (`app`).
- **MCP geht noch nicht oder es gibt noch keine App** (`hilfe_anfordern` braucht eine eigene App): Gib eine fertige Nachricht aus, die der Kollege selbst an Felix schickt (z. B. per Teams). Du verschickst sie nicht. Vorlage:

  ```text
  Hallo Felix, ich richte die Adler-Plattform ein. Es fehlt noch:
  - <Punkt, z. B. Einladung in die GitHub-Org adler-schiffe>
  - <Punkt, z. B. Gruppe platform_developer und Attribut github in Authentik>
  Mein GitHub-Login: <login aus gh auth status>
  Mein Adler-Login (Authentik): <Benutzername>
  Danke!
  ```

  Keine Tokens in die Nachricht schreiben.

## Wenn alles passt

Sag dem Kollegen, dass er startklar ist. Nächster Schritt: eine neue App anmelden (Skill `adler-neue-app`) oder an einer bestehenden App weiterarbeiten.

## Nie

- Den Token ausgeben, anzeigen, in den Chat holen oder selbst in eine Datei schreiben. Kein `echo $ADLER_MCP_TOKEN`, kein `env`, kein `printenv`, kein `cat ~/.zshrc`, unter Windows kein `$env:ADLER_MCP_TOKEN`, kein `Get-ChildItem env:`, kein `[Environment]::GetEnvironmentVariable`.
- Secrets oder `.env`-Dateien lesen.
- `ssh`, `kubectl`, `helm` oder `flux` verwenden. Kollegen brauchen keinen Cluster-Zugang.
- Eine Mail an Felix schreiben oder etwas selbst verschicken. Einzige Ausnahme: die vorformulierte Nachricht oben, die der Kollege selbst schickt, solange der MCP nicht geht oder es noch keine App gibt.
- Auf `main` pushen.
