# pi-provider-logger

A [pi](https://github.com/earendil-works/pi) extension that logs every provider request and response to a file, and shows a short notification in the UI.

## What it does

- On `before_provider_request`: writes the request payload (plus model API and base URL) to a log file and shows a `→ Request: provider/id (api)` notification.
- On `after_provider_response`: writes the response status and headers to the same log file and shows a `← Response: <status>` notification (red on 4xx/5xx).

## Log location

```sh
~/.pi/logs/provider-requests.log
```

The directory is created on first write. Each entry is delimited by `===` banners, e.g.:

```text
=== PROVIDER REQUEST ===
Time: 2025-01-01T00:00:00.000Z
Model api: openai-completions
Model baseUrl: https://api.openai.com/v1/

Payload (provider-specific request parameters):
{
  "model": "gpt-5.4-mini",
  "messages": [...]
}
========================
```

## Install

### From npm (recommended):

#### Instal globally

```sh
pi install npm:@jsynowiec/pi-provider-logger
```

#### Project-local install:

```sh
pi install -l npm:@jsynowiec/pi-provider-logger
```

### Using git:

```sh
pi install git:github.com/jsynowiec/pi-provider-logger
```

## Development

```sh
npm run check      # biome check --write --error-on-warnings src
npm run typecheck  # tsc --noEmit
```

Logging failures (permissions, full disk, etc.) are caught and printed to `stderr`; they never abort the agent.
