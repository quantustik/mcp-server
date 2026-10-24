#!/usr/bin/env node
/**
 * Thin stdio -> remote proxy for the hosted Quantustik MCP server.
 *
 * This package does not implement an MCP server itself. It is a wrapper
 * around `mcp-remote` (https://www.npmjs.com/package/mcp-remote) pointed at
 * our hosted streamable-HTTP endpoint, so MCP clients that only speak stdio
 * (Claude Desktop, Cursor, Windsurf, ...) can reach it via a single
 * `npx @quantustik/mcp-server` entry.
 *
 * All data comes from the live https://quantustik.com API. No local state,
 * no local computation, no bundled model.
 */

"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const DEFAULT_ENDPOINT = "https://quantustik.com/mcp";

function resolveProxyEntry() {
  // Resolve mcp-remote's own CLI entry point rather than shelling out to
  // `npx mcp-remote`, so this package works fully offline once installed
  // and doesn't trigger a second npm resolution at runtime.
  const pkgPath = require.resolve("mcp-remote/package.json");
  const pkg = require(pkgPath);
  const binField = pkg.bin && (pkg.bin["mcp-remote"] || pkg.bin);
  const binRelative = typeof binField === "string" ? binField : binField["mcp-remote"];
  return path.join(path.dirname(pkgPath), binRelative);
}

function main() {
  const userArgs = process.argv.slice(2);
  const endpoint =
    process.env.QUANTUSTIK_MCP_URL && process.env.QUANTUSTIK_MCP_URL.trim()
      ? process.env.QUANTUSTIK_MCP_URL.trim()
      : DEFAULT_ENDPOINT;

  const args = [endpoint, "--transport", "http-only"];

  // Optional API key -> Authorization header. Free tier works keyless
  // (anonymous per-IP quota); a key raises the hourly cap. Get one at
  // https://quantustik.com/developers.
  if (process.env.QUANTUSTIK_API_KEY && process.env.QUANTUSTIK_API_KEY.trim()) {
    args.push("--header", `Authorization:Bearer ${process.env.QUANTUSTIK_API_KEY.trim()}`);
  }

  // Allow callers to pass through additional mcp-remote flags (e.g.
  // --debug, --resource) after the package's own args.
  args.push(...userArgs);

  const proxyEntry = resolveProxyEntry();
  const result = spawnSync(process.execPath, [proxyEntry, ...args], {
    stdio: "inherit",
  });

  if (result.error) {
    console.error("[quantustik-mcp] failed to start proxy:", result.error.message);
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
}

main();
