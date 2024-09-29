[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v3/monitor/1kwhy.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
# Jira Worklogs Manager

Simple application allowing you to add and review your Jira worklogs.

## Core features:

- Quickly review your worklogs for selected date
- Log work to an issue

## How to use:

### Official website:
Open the [website](https://jira-worklogs-manager.netlify.app/) in your browser, fill in the configuration page and start using it out of the box.

### Run locally:
1. Fork this repository.
2. Install dependencies.
3. Set environment variables in your .env file.
```bash
COOKIE_SECRET="{Fill this with a random string}"
API_VERSION="{Specify Jira API version number you want to use, currently used version is '2'}"
```
4. Run development server.
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3333](http://localhost:3333) with your browser.
6. Fill in the configuration page and you can start using the app.

## Contribution:
For contributions, please fork this repository, follow how to use section of this readme and later submit a pull request.

You can also open an issue or discussion in case of any questions.
