# fundos-por-letra

Plugin para o programa SPresenter, buscando permitir associar de forma fácil um fundo a uma letra, ao iniciar a letra inicia-se o fundo em uma camada configurada, permitindo salvar fundos para música assim como no Holyrics.

A Spresenter plugin that composes a **custom presentation** (a theme built in
code, with elements that have stable ids) and then controls those elements
**by id, in real time** — text/style update live as you type, without reloading
the theme. Its UI panel opens **floating** in the main window — dock it wherever
you like (or open it in a separate window from **Settings → Plugins → Open in
window**).

Core API used:

```ts
// Grab an element by id and modify it freely (chainable):
spresenter.live.element(output, layer, 'line1').setText('Hello').setStyle({ color: '#ffd479' });
// or a raw patch:
spresenter.live.setElement(output, layer, 'line1', { html: '<b>Hi</b>' });
```

## Structure

```
manifest.json      Plugin metadata + declared permissions + panels
src/code.ts        Logic thread (no DOM) — talks to the app via `spresenter`
src/ui/            UI thread (React + Tailwind) rendered in a sandboxed iframe
dist/              Build output (code.js + ui/) — this is what the app loads
```

## Develop

```bash
npm install
npm run dev        # rebuilds code + ui on change
```

Then in Spresenter: **Settings → Plugins → Load folder (dev)** and pick this folder.
Edits to `dist/` reload the plugin automatically.

## Build for distribution

```bash
npm run build
```

Zip the folder (with `dist/` and `manifest.json` at the root) and install it via
**Settings → Plugins → Install (.zip/folder)**.

## How it works

The plugin runs in two threads, like Figma:

- **`src/code.ts`** runs isolated (no DOM). It calls the app through the global
  `spresenter` object, which routes to the same cores the REST API uses.
- **`src/ui/`** runs in a sandboxed iframe and only talks to `code.ts` via
  `postMessage`/`onMessage` from `@spresenter/plugin-sdk/ui`.

Only what you declare in `manifest.json` `permissions` is allowed.
