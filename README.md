<div align="center">
  <img align="center" width="100%" src="doc-assets/header.svg" alt="CloudFlags" />
</div>

*Super basic feature flag service with a simple API and UI*

🪨 **Hyper Simplistic** - Simplistic & concise API and basic UI

⚡ **Blazing Fast** with Cloudflare Workers and KV on the edge

Feel free to look through the tiny codebase to understand how it works.

## 🚀 Quick Start
1. Create a KV namespace for the flags to be stored in and update the `wrangler.toml` file with the namespace ID.
2. Make any changes you want to the `wrangler.toml` file and the codebase in general.
3. `npm run deploy` or `wrangler publish` to deploy the worker.
4. Protect admin routes below with Cloudflare Access.
5. 🚩😎👌

## 📖 API
### `GET /flags`
Returns a list of all flags as a JSON array.
### `GET /flag/:name`
Returns `true` or `false` depending on whether the flag is enabled or not.
### `GET /`
Admin UI for managing flags, use your browser for this one 🌐
### `POST /add`
Takes a `application/x-www-form-urlencoded` body with a `flag` field and adds it to the list of flags (disabled).
### `POST /remove`
Takes a `application/x-www-form-urlencoded` body with a `flag` field and removes it from the list of flags (disabled flags only).
### `POST /enable`
Takes a `application/x-www-form-urlencoded` body with a `flag` field and enables it.
### `POST /disable`
Takes a `application/x-www-form-urlencoded` body with a `flag` field and disables it.