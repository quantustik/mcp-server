# Quantustik MCP server — S&P 500 market data

**Quantustik is a market data service for the S&P 500 — prices, fundamentals, SEC filings, insider and Congress trades, macro indicators and market conditions — for investors and AI agents, through a dashboard, a REST API and an MCP server.**

The hosted MCP server at `https://quantustik.com/mcp` (streamable-HTTP) needs
no API key. It serves nine tools:

| Tool | What it returns |
|---|---|
| `get_fear_greed` | CNN Fear & Greed index (0-100) |
| `get_earnings_calendar` | Next and last earnings dates for a ticker |
| `get_insider_pulse` | SEC Form 4 insider activity, per ticker or an S&P 500 screener |
| `get_filings_digest` | SEC 8-K event digest, per ticker or a recent site-wide feed |
| `get_filing_language_diff` | What changed in the prose between a ticker's two most recent 10-K or 10-Q filings |
| `get_institutional_activity` | 13F institutional ownership changes and SC 13D/G activist filings |
| `get_congress_trades` | STOCK Act disclosures from the House Clerk and Senate eFD |
| `list_capabilities` | Discover all tools and resources |
| `get_started` | Onboarding: per-tier quotas and how a free API key raises them |

Every value carries its source and as-of date. Quantustik publishes measured
data only, with no predictions and no recommendations.

> **Educational research only — not financial advice.** Nothing here is a
> recommendation to buy or sell any security.

## Connect

Clients that support remote streamable-HTTP servers can point straight at
`https://quantustik.com/mcp`. Clients that only support local stdio servers
(Claude Desktop, Cursor, Windsurf and others) can use this package, described
below. Anonymous use is allowed under a per-IP hourly quota; a free key from
[quantustik.com/developers](https://quantustik.com/developers) raises it.

## What this package is

A thin stdio proxy to Quantustik's hosted MCP server. It lets MCP clients
that only support local stdio servers (Claude Desktop, Cursor, Windsurf,
and others) reach the live, keyless, streamable-HTTP endpoint at
`https://quantustik.com/mcp`.

This package does not implement an MCP server itself, run any model
locally, or cache any data. It is a small wrapper around
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) pointed at our
hosted endpoint. Every tool call is forwarded live to `quantustik.com` and
answered from the same data and quota system as the hosted endpoint.

If your MCP client supports remote streamable-HTTP servers directly, you
don't need this package at all — just point it at `https://quantustik.com/mcp`.
This wrapper exists only for stdio-only clients.

The full tool catalog lives at
[quantustik.com/developers](https://quantustik.com/developers).

## Usage

### Claude Desktop / Cursor / Windsurf

Add to your MCP client config (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "quantustik": {
      "command": "npx",
      "args": ["-y", "@quantustik/mcp-server"]
    }
  }
}
```

### Command line

```bash
npx -y @quantustik/mcp-server
```

This starts a local stdio MCP server that proxies to
`https://quantustik.com/mcp`. Anonymous use is allowed under a per-IP hourly
quota; no setup required.

### Optional: raise your quota with an API key

Get a free key at [quantustik.com/developers](https://quantustik.com/developers),
then set it as an environment variable:

```json
{
  "mcpServers": {
    "quantustik": {
      "command": "npx",
      "args": ["-y", "@quantustik/mcp-server"],
      "env": {
        "QUANTUSTIK_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `QUANTUSTIK_API_KEY` | Sent as `Authorization: Bearer <key>` to raise the anonymous per-IP hourly quota. | none (anonymous) |
| `QUANTUSTIK_MCP_URL` | Override the remote endpoint (mainly for local development against a non-production instance). | `https://quantustik.com/mcp` |

Any additional CLI arguments you pass are forwarded to the underlying
`mcp-remote` proxy (e.g. `--debug`).

## How it works

`npx @quantustik/mcp-server` runs a small Node script
(`bin/quantustik-mcp.js`) that spawns
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) against
`https://quantustik.com/mcp` using the `http-only` transport (our endpoint
is streamable-HTTP, not SSE). `mcp-remote` speaks stdio to your MCP client
on one side and streamable-HTTP to our server on the other — this package
just pins the URL, transport, and optional auth header so you don't have to
remember them.

## Source

Server implementation (Python, FastMCP): the hosted endpoint's source lives
in [mcplafed/autoevolve](https://github.com/mcplafed/autoevolve)
(`app/mcp_server.py`, `server.json`). This wrapper repo only contains the
thin npm client shown above.

## Disclaimer

Market data returned by the Quantustik MCP server is for educational and
research purposes only and does not constitute personalized financial
advice. Always consult a qualified financial professional before making
investment decisions.

## License

MIT — see [LICENSE](LICENSE).
