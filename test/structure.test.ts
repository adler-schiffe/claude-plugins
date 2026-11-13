import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const readJson = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));

const SKILLS = [
  "adler-aenderung-ausliefern",
  "adler-neue-app",
  "adler-onboarding",
  "adler-problem",
];

describe("marketplace", () => {
  const m = readJson(".claude-plugin/marketplace.json");
  test("name and plugin entry", () => {
    expect(m.name).toBe("adler-schiffe");
    expect(m.owner?.name).toBeTruthy();
    const p = m.plugins.find((x: { name: string }) => x.name === "adler");
    expect(p?.source).toBe("./plugins/adler");
  });
});

describe("plugin", () => {
  test("plugin.json name", () => {
    expect(readJson("plugins/adler/.claude-plugin/plugin.json").name).toBe("adler");
  });
  test(".mcp.json server adler", () => {
    const s = readJson("plugins/adler/.mcp.json").mcpServers.adler;
    expect(s.type).toBe("http");
    expect(s.url).toBe("https://platform.app.adler-schiffe.de/mcp");
    expect(s.headers.Authorization).toBe("Bearer ${ADLER_MCP_TOKEN}");
  });
});

describe("skills", () => {
  const dir = join(root, "plugins/adler/skills");
  const names = readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory());
  test("exactly the four skills", () => {
    expect([...names].sort()).toEqual(SKILLS);
  });
  for (const n of names) {
    test(`${n} has valid frontmatter`, () => {
      const file = join(dir, n, "SKILL.md");
      expect(existsSync(file)).toBe(true);
      const fm = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
      expect(fm).not.toBeNull();
      const get = (k: string) => fm![1].match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1].trim();
      expect(get("name")).toBe(n);
      expect(get("description")).toBeTruthy();
    });
  }
});

describe("no secrets", () => {
  test("no token-like string in any file", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((f) => {
        if (f === ".git" || f === "node_modules") return [];
        const p = join(d, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    const re = new RegExp("adp_" + "[A-Za-z0-9]{8,}");
    for (const f of walk(root)) expect(readFileSync(f, "utf8")).not.toMatch(re);
  });
});
