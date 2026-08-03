# Quantustik MCP server — quantum-model S&P 500 analytics

**[Quantustik](https://quantustik.com) is a risk-first market-intelligence
layer for humans and AI agents — calibrated probabilistic forecasts,
transparent track records, and machine-readable decision support through
REST and MCP.** It forecasts S&P 500 price paths with a quantum-mechanics
model (the
Schrödinger equation and Feynman path integrals), layers a machine-learning
classifier and a market-conditions read on top, and turns the result into
**risk-first BUY / WAIT / AVOID / EXIT signals** — each with entry price,
stop-loss, take-profit ladder and position sizing, plus **calibrated 90%
confidence bands** and a **live, auditable track record that includes the
losses**.

**What the analysis gives you, per ticker and for the whole index:**

- a signal with the full trade plan behind it (only actionable at ≥2:1
  reward-to-risk), and a two-sided explanation of *why* the model made
  the call;
- multi-horizon price forecasts (1mo / 3mo / 6mo / 1y) with measured,
  published calibration — never a bare point estimate;
- whole-universe scans (conviction / direction / sector filters), a
  risk-vetted shortlist of asymmetric setups, market conditions and an
  overheating gauge, backtests, fundamentals, dividends and more —
  24 tools in total.

**Who it is for:** AI agents and their users doing market research —
analysts, self-directed investors, and anyone who wants honest,
uncertainty-explicit market context inside Claude, Cursor, ChatGPT or any
other MCP client. Bullish calls are deliberately rare and earned: the model
prefers saying WAIT to flattering you.

> **Educational research only — not investment advice.** Nothing here is a
> recommendation to buy or sell any security. Calibration is measured, not
> guaranteed; past model performance does not predict future results.

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

All signals, forecasts, and market data returned by the Quantustik MCP
server are for educational and research purposes only and do not
constitute personalized financial advice. Past model performance does not
guarantee future results. Always consult a qualified financial professional
before making investment decisions.

## License

MIT — see [LICENSE](LICENSE).
