# Quarter

Less is more

## Development

### Initial Setup

Create a `.env` in the project root like this one:

```
# Server-only (secrets)
SESSION_SECRET=change me to a random secret string

# Variables prefixed with PUBLIC_ are given to the client
PUBLIC_TAKESHAPE_API_ENDPOINT=copy from takeshape dashboard
PUBLIC_TAKESHAPE_API_KEY=create in takeshape project settings
PUBLIC_TAKESHAPE_API_MUTATION_NAME=myAgent

```

### Run In Dev Mode

```
npm run dev
```

See `package.json` for more NPM scripts
