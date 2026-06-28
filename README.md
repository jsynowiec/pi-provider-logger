# pi-provider-logger

A [pi](https://github.com/earendil-works/pi) extension that logs every provider request and response to a file, and shows a short notification in the UI.

## What it does

- On `before_provider_request`: writes the request payload (plus model API and base URL) to a log file and shows a `→ Request: provider/id (api)` notification.
- On `after_provider_response`: writes the response status and headers to the same log file and shows a `← Response: <status>` notification (red on 4xx/5xx).

## Log location

```
~/.pi/logs/provider-requests.log
```

The directory is created on first write. Each entry is delimited by `===` banners, e.g.:

```
=== PROVIDER REQUEST ===
Time: 2025-01-01T00:00:00.000Z
Model api: openai-completions
Model baseUrl: https://api.example.com/v1

Payload (provider-specific request parameters):
{
  "model": "gpt-4o",
  "messages": [...]
}
========================
```

## Install

This package is loaded by pi as a local extension via the `pi.extensions` field in `package.json`; no extra install step is required when running from a checkout. To consume it as a dependency from another project, add it to that project's `pi.extensions` list.

## Development

```sh
npm run check      # biome check --write --error-on-warnings src
npm run typecheck  # tsc --noEmit
```

Logging failures (permissions, full disk, etc.) are caught and printed to `stderr`; they never abort the agent.
