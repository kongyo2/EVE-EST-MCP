# Contributing

This document outlines the rules for developing the MCP server.

## Before you start

- Run `npm install` to install the dependencies.
- Run `npm run lint` to run Prettier, ESLint, and TypeScript type-checking. Fix all reported issues before committing.
- Follow the template to develop the MCP server.

## Testing

- Organize tests to mirror source code structure
- Use descriptive test names that explain the behavior
- Follow AAA pattern (Arrange, Act, Assert)
- When testing an MCP server that uses an API or performs network requests, always hit the actual API/real network endpoints in tests. Do not mock HTTP clients or endpoints for behavior verification.
- Test each tool with valid inputs.
- Verify that the output format is correct.
- Do not proceed until all tools have been tested with valid inputs and the output format of each tool is correct.
- Do not use `npm run dev` or `npm run start` to skip test implementation, as you cannot operate the interactive CLI due to its nature.
- When adding tests, first examine existing tests to understand and conform to established conventions. Pay attention to the mocks at the beginning of existing test files, as they reveal important dependencies and how they are managed in the test environment.

