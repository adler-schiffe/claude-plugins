---
name: adler-onboarding
description: Richtet den Rechner eines Kollegen für die Adler-Plattform ein (Git, GitHub CLI, GitHub-Login, Org adler-schiffe, Bun, Docker, Ordner ~/Apps, MCP-Token im Plugin, MCP-Verbindung) und prüft, was fehlt. Verwenden, wenn ein Kollege neu startet oder etwas mit dem Zugang nicht geht, z. B. „Richte mich für die Adler-Plattform ein“, „einrichten“, „Onboarding“, „ich bin neu“, „MCP geht nicht“, „401“, „Token“, „adler-Werkzeuge fehlen“, „kein Zugriff“, „bitte Onboarding bei Felix abschließen“.
---

# Adler-Plattform einrichten

Du richtest den Rechner eines Kollegen ein, der kein Entwickler ist. Grundregel: **Was du selbst machen kannst, machst du.** Der Kollege macht nur, was du nicht kannst:

- Fenster und Abfragen des Betriebssystems bestätigen (Windows: „Ja“ bei der Benutzerkontensteuerung, macOS: Dialoge und Passwort).
- Den Code, den du ihm nennst, im Browser auf github.com eingeben.
- Den MCP-Token im Browser erzeugen und in das verdeckte Feld von Claude Code einfügen.
- Claude Code neu starten, wenn du darum bittest.

Sprich einfach und freundlich, ohne Fachwörter. Sag vor jedem Schritt in einem Satz, was du tust und warum, und frag vor jeder Installation kurz: „Darf ich … installieren?“ Prüfe immer zuerst, ob etwas schon da ist, und überspringe es dann. So kann der Kollege den Skill jederzeit neu starten, z. B. nach einem Neustart von Claude Code, und es geht dort weiter, wo es aufgehört hat.

Zeige am Ende eine kurze Liste: was passt, was fehlt, was nur Felix kann.

## 1. Betriebssystem feststellen

Deine Umgebung zeigt, ob der Kollege macOS oder Windows nutzt (sonst frag nach). Nutze danach nur die Befehle für sein System.

Unter Windows führst du die Befehle in PowerShell aus. Ist deine Shell Git Bash, rufst du PowerShell so auf: `powershell -NoProfile -Command "<befehl>"`. Bei `winget` immer `--accept-package-agreements --accept-source-agreements` anhängen, sonst wartet winget auf eine Eingabe.

## 2. Programme installieren

Erst alle fehlenden Programme installieren, dann einmal neu starten (Schritt 3). Prüfe jedes Programm einzeln.

### a. Git

- **Windows:** `git --version`. Fehlt Git:
  ```powershell
  winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
  ```
  Sag vorher: „Gleich fragt Windows, ob die App Änderungen vornehmen darf. Bitte auf ‚Ja‘ klicken.“
- **macOS:** `xcode-select -p`. Gibt es einen Fehler, fehlen die Entwicklerwerkzeuge von Apple (darin steckt Git):
  ```sh
  xcode-select --install
  ```
  Sag vorher: „Gleich öffnet sich ein Fenster von Apple. Bitte auf ‚Installieren‘ klicken und den Bedingungen zustimmen. Das dauert ein paar Minuten. Sag mir Bescheid, wenn es fertig ist.“ Danach mit `git --version` prüfen.

### b. GitHub CLI (`gh`)

Prüfen: `gh --version`.

- **Windows:**
  ```powershell
  winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
  ```
  Auch hier fragt Windows nach: „Ja“.
- **macOS mit Homebrew** (`brew --version` klappt): `brew install gh`
- **macOS ohne Homebrew:** Installiere `gh` ohne Passwort in `~/.local/bin` (dort liegt auch `claude`):
  ```sh
  set -e
  arch=$(uname -m); [ "$arch" = x86_64 ] && arch=amd64
  tag=$(curl -fsSL https://api.github.com/repos/cli/cli/releases/latest | sed -n 's/.*"tag_name": *"\(v[^"]*\)".*/\1/p')
  ver=${tag#v}
  tmp=$(mktemp -d)
  curl -fsSL -o "$tmp/gh.zip" "https://github.com/cli/cli/releases/download/$tag/gh_${ver}_macOS_${arch}.zip"
  unzip -q "$tmp/gh.zip" -d "$tmp"
  mkdir -p ~/.local/bin
  cp "$tmp/gh_${ver}_macOS_${arch}/bin/gh" ~/.local/bin/gh
  rm -rf "$tmp"
  ~/.local/bin/gh --version
  ```
  Prüfe mit `command -v gh`, ob `gh` gefunden wird. Wenn nicht, fehlt `~/.local/bin` im Suchpfad. Dann hängst du die Zeile `export PATH="$HOME/.local/bin:$PATH"` an `~/.zshrc` an (nur diese Zeile, nichts anderes) und startest später neu.

### c. Bun

Prüfen: `bun --version`. Fehlt Bun:

- **macOS:** `curl -fsSL https://bun.sh/install | bash`
- **Windows:** `powershell -c "irm bun.sh/install.ps1|iex"`

### d. Docker Desktop

Docker braucht man, um eine App lokal mit Datenbank zu starten. Prüfen: `docker --version`.

- **Windows:**
  ```powershell
  winget install --id Docker.DockerDesktop -e --source winget --accept-package-agreements --accept-source-agreements
  ```
  Windows fragt nach („Ja“). Docker Desktop braucht WSL 2. Fragt die Installation danach oder will Windows neu starten: bestätigen, neu starten, danach Claude Code wieder öffnen und diesen Skill erneut starten. Klappt winget nicht, öffne die Download-Seite: `Start-Process https://www.docker.com/products/docker-desktop/`.
- **macOS mit Homebrew:** `brew install --cask docker` (macOS fragt eventuell nach dem Passwort).
- **macOS ohne Homebrew:** Öffne die Download-Seite mit `open https://www.docker.com/products/docker-desktop/` und erkläre: „Lade ‚Docker Desktop for Mac‘ herunter (Apple-Chip oder Intel, wie dein Mac), öffne die Datei und zieh den Wal in den Ordner Programme.“

Danach: „Bitte starte Docker Desktop einmal (Programme bzw. Startmenü), akzeptiere die Bedingungen und warte, bis es läuft. Ein Konto brauchst du nicht, ‚Skip‘ reicht.“ Prüfen mit `docker info --format '{{.ServerVersion}}'`. Scheitert der Befehl, läuft Docker Desktop noch nicht.

## 3. Claude Code neu starten (wenn etwas installiert wurde)

Neu installierte Programme sieht Claude Code erst nach einem Neustart. Wurde in Schritt 2 etwas installiert, sag:

> Damit ich die neuen Programme nutzen kann, starte mich bitte neu: Tippe `/exit`, schließ das Terminal-Fenster, öffne ein neues, tippe `claude` und dann noch einmal „Richte mich für die Adler-Plattform ein.“ Ich mache dann dort weiter.

Hör danach auf. Nach dem Neustart überspringst du alles, was schon da ist.

## 4. GitHub verbinden

Prüfen: `gh auth status`. Ist der Kollege angemeldet, weiter mit `gh auth setup-git` und Schritt 5.

Sonst meldest du ihn an:

1. Starte im Hintergrund:
   ```sh
   gh auth login --web --hostname github.com --git-protocol https
   ```
2. Lies aus der Ausgabe den Einmal-Code (Form `XXXX-XXXX`). Er liegt meist auch schon in der Zwischenablage.
3. Öffne die Seite für den Kollegen: macOS `open https://github.com/login/device`, Windows `Start-Process https://github.com/login/device`.
4. Sag: „Im Browser ist jetzt GitHub offen. Melde dich an, falls nötig, gib den Code **XXXX-XXXX** ein und bestätige mit ‚Authorize‘. Sag mir Bescheid, wenn es geklappt hat.“
5. Warte, bis der Hintergrundbefehl fertig ist, dann `gh auth status` und `gh auth setup-git`.

Ist der Code abgelaufen (nach etwa 15 Minuten), starte den Befehl neu. Nie `--show-token` verwenden.

## 5. Mitglied der Org `adler-schiffe`

```sh
gh api user/memberships/orgs/adler-schiffe --jq .state
```

Gib nur den Status aus, nichts anderes.

- `active`: passt.
- `pending`: Es gibt eine Einladung. Öffne <https://github.com/orgs/adler-schiffe/invitation> für den Kollegen, er klickt auf „Join“.
- Fehler 404: kein Mitglied. Das kann nur Felix (Einladung in die Org).
- Fehler 403 wegen fehlender Rechte des Logins: `gh auth refresh -s read:org` (wieder mit Code wie in Schritt 4), dann erneut prüfen.

## 6. Ordner für Apps

Lege den Ordner `~/Apps` an, falls er fehlt. Dort landen später alle Apps.

- **macOS:** `mkdir -p ~/Apps`
- **Windows:** `New-Item -ItemType Directory -Force "$HOME\Apps"`

## 7. MCP-Token im Plugin

Der Token steckt in der Einstellung `mcp_token` des Plugins `adler`. Claude Code speichert ihn im sicheren Speicher des Betriebssystems. Prüfe nur, ob er gesetzt ist:

```sh
claude plugin configure adler@adler-schiffe
```

Der Befehl zeigt nur, welche Einstellungen gesetzt sind, nie den Wert. Ist `mcp_token` gesetzt, weiter mit Schritt 8.

Fehlt er, erkläre:

1. Öffne <https://platform.app.adler-schiffe.de/tokens> für den Kollegen (macOS `open …`, Windows `Start-Process …`). Er meldet sich mit dem Adler-Login an, gibt eine Bezeichnung ein (z. B. „Laptop“) und klickt auf „Token erstellen“. Der Token wird nur einmal angezeigt.
   - Meldung „GitHub-Login fehlt in Authentik, bitte Felix fragen“: Das kann nur Felix (Attribut `github` am Benutzer).
   - Kein Zugriff auf die Seite: Die Gruppe `platform_developer` fehlt. Das kann nur Felix.
2. „Kopiere den Token. Tippe hier in Claude Code `/plugin configure adler@adler-schiffe` und Enter. Es öffnet sich ein Feld ‚MCP-Token‘. Füge den Token dort ein und drücke Enter. Das Feld ist verdeckt, du siehst nur Sternchen.“
3. „Danach bitte Claude Code neu starten: `/exit`, dann `claude`, und noch einmal ‚Richte mich für die Adler-Plattform ein.‘“

Den Befehl `/plugin configure` tippt der Kollege selbst, du kannst ihn nicht ausführen.

Der Token kommt **nie** in den Chat. Bietet der Kollege an, ihn in den Chat zu kopieren, lehne ab und verweise auf `/plugin configure adler@adler-schiffe`. Ist er doch im Chat gelandet: Der Kollege löscht ihn unter `/tokens`, erzeugt einen neuen und trägt ihn per `/plugin configure adler@adler-schiffe` ein.

Der Token merkt sich Gruppen und GitHub-Login zum Zeitpunkt der Erstellung. Hat Felix danach etwas geändert (Gruppe `platform_developer`, Attribut `github`), braucht der Kollege einen neuen Token, eingetragen wie oben.

## 8. MCP-Verbindung

Rufe das Werkzeug `meine_apps` des MCP-Servers `adler` auf (keine Eingabe).

- Antwort ist eine Liste oder „Du hast noch keine Apps.“: Die Verbindung steht.
- 401 oder „nicht angemeldet“: Der Token fehlt, ist falsch oder gelöscht. Neuen Token unter `/tokens` erzeugen und per `/plugin configure adler@adler-schiffe` eintragen, dann Claude Code neu starten (Schritt 7).
- „Dafür fehlt dir die Berechtigung (Gruppe platform_developer)“: Das kann nur Felix. Danach braucht der Kollege einen neuen Token.
- Das Werkzeug gibt es gar nicht: Das Plugin `adler` ist nicht installiert oder der Server ist nicht verbunden. Der Kollege tippt `/mcp` und schaut, ob `plugin:adler:adler` verbunden ist. Sonst installiert er das Plugin: `/plugin marketplace add adler-schiffe/claude-plugins`, dann `/plugin install adler@adler-schiffe` (fragt nach dem Token), dann Neustart.
- Fehler beim Hinzufügen des Marketplace `adler-schiffe/claude-plugins` (Repo nicht gefunden): Der Kollege hat keinen Lesezugriff auf das Repo. Das kann nur Felix.

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

- Nach dem Token fragen oder ihn im Chat annehmen, ausgeben oder in eine Datei schreiben.
- Den Token selbst eintragen, z. B. mit `claude plugin configure --values-stdin` oder `--config`. Das macht nur der Kollege im verdeckten Feld.
- Umgebungsvariablen, Schlüsselbund, Anmeldedaten-Speicher oder Dateien mit Zugangsdaten ausgeben: kein `env`, kein `printenv`, kein `Get-ChildItem env:`, kein `security find-generic-password`, kein `cmdkey`, kein `cat` auf `~/.claude.json`, `~/.claude/` oder `~/.config/gh/hosts.yml`.
- `gh auth token` oder `gh auth login … --show-token` verwenden.
- Secrets oder `.env`-Dateien lesen.
- `ssh`, `kubectl`, `helm` oder `flux` verwenden. Kollegen brauchen keinen Cluster-Zugang.
- Eine Mail an Felix schreiben oder etwas selbst verschicken. Einzige Ausnahme: die vorformulierte Nachricht oben, die der Kollege selbst schickt, solange der MCP nicht geht oder es noch keine App gibt.
- Auf `main` pushen.
