# @quantustik/mcp-server

A thin stdio proxy to [Quantustik](https://quantustik.com)'s hosted MCP
server. It lets MCP clients that only support local stdio servers (Claude
Desktop, Cursor, Windsurf, and others) reach our live, keyless,
streamable-HTTP endpoint at `https://quantustik.com/mcp`.

This package does not implement an MCP server itself, run any model
locally, or cache any data. It is a small wrapper around
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) pointed at our
hosted endpoint. Every tool call is forwarded live to `quantustik.com` and
answered from the same data and quota system as the hosted endpoint.

If your MCP client supports remote streamable-HTTP servers directly, you
don't need this package at all — just point it at `https://quantustik.com/mcp`.
This wrapper exists only for stdio-only clients.

## What you get

Live S&P 500 signals, forecasts, trade plans, market-regime data, and more —
powered by Quantustik's quantum-mechanics-based forecasting model
(Schrödinger equation + Feynman path integrals). See the full tool list at
[quantustik.com/developers](https://quantustik.com/developers).

**Educational and research purposes only — not personalized financial advice.**

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

All signals, forecasts, and market data returned by the Quantustik MCP
server are for educational and research purposes only and do not
constitute personalized financial advice. Past model performance does not
guarantee future results. Always consult a qualified financial professional
before making investment decisions.

## License

MIT — see [LICENSE](LICENSE).
