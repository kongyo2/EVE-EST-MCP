# EVE Online EST MCP Server

An MCP server for EVE Online that provides EVE Server Time (EST) information and downtime calculations.

EVE Server Time (EST) is identical to UTC and is the standard time used across all EVE Online servers. This server provides current EST time and calculates time remaining until the next daily server downtime.

## Features

- **Current EVE Server Time**: Get the current time in EVE Server Time format (identical to UTC)
- **Downtime Information**: Daily server maintenance occurs from 11:00 to 11:15 EST (UTC)
- **Time Until Downtime**: Calculates hours and minutes until the next server downtime
- **Downtime Status**: Indicates if the server is currently in downtime

## Tool: getCurrentESTTime

This tool provides comprehensive EVE Online server time information:

```json
{
  "currentTime": "2025-01-08 15:30:45 EST",
  "utcTime": "2025-01-08T15:30:45.123Z",
  "isInDowntime": false,
  "downtimeWindow": "11:00 to 11:15 EST (UTC)",
  "timeUntilNextDowntime": "19h 29m",
  "nextDowntimeStart": "2025-01-09 11:00:00 EST"
}
```

## Development

To get started, clone the repository and install the dependencies.

```bash
git clone https://github.com/your-username/eve-online-est-mcp-server.git
cd eve-online-est-mcp-server
npm install
npm run dev
```

### Start the server

If you simply want to start the server, you can use the `start` script.

```bash
npm run start
```

However, you can also interact with the server using the `dev` script.

```bash
npm run dev
```

This will start the server and allow you to interact with it using CLI.

### Testing

The server includes tests for time calculations and EST formatting.

```bash
npm run test
```

The tests verify the EVE Server Time calculations and downtime logic.

### Linting

Having a good linting setup reduces the friction for other developers to contribute to your project.

```bash
npm run lint
```

This boilerplate uses [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) and [TypeScript ESLint](https://typescript-eslint.io/) to lint the code.

### Formatting

Use `npm run format` to format the code.

```bash
npm run format
```

### GitHub Actions

This repository has a GitHub Actions workflow that runs linting, formatting, tests, and publishes package updates to NPM using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

In order to use this workflow, you need to:

1. Add `NPM_TOKEN` to the repository secrets
   1. [Create a new automation token](https://www.npmjs.com/settings/punkpeye/tokens/new)
   2. Add token as `NPM_TOKEN` environment secret (Settings → Secrets and Variables → Actions → "Manage environment secrets" → "release" → Add environment secret)
1. Grant write access to the workflow (Settings → Actions → General → Workflow permissions → "Read and write permissions")
