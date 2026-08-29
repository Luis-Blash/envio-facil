# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Envío Fácil: a single-file Node.js/Express server (`server.js`) that runs on a
Termux (Android) device and lets devices on the same local WiFi network
upload, list, download, and delete files through a browser — no build step,
no frontend framework. It's designed to work in an old Android WebView
(the target client is an Android 4.4 tablet), so the frontend is plain
ES5 JS using `XMLHttpRequest`, never `fetch`.

## Commands

```bash
npm install     # install express + multer
npm start        # same as: node server.js
```

There is no build, lint, or test tooling in this project.

## Architecture

- `server.js` — the entire backend. Serves `public/` as static files, and
  separately serves `uploads/` as static files under `/uploads` for direct
  file downloads.
  - `GET /files` returns a JSON listing of `uploads/` (name, size, mtime).
  - `POST /upload` (multipart via multer) saves to `uploads/`, prefixing
    each stored filename with `Date.now()-` and sanitizing the original
    name to `[a-zA-Z0-9._-]` to avoid collisions and path issues.
  - `POST /delete` takes a `name` form field and unlinks that file from
    `uploads/`. It rejects any name containing `/`, `\`, or `..` — this is
    the only defense against path traversal, since it works directly with
    filenames from `/files` rather than user-supplied paths.
  - The server binds `0.0.0.0:3000` and prints its LAN IP (via
    `os.networkInterfaces()`) on startup so a phone/tablet on the same
    WiFi knows what URL to open.
- `public/index.html` — the entire frontend in one file: inline `<style>`
  and `<script>`, no external assets. Polls `GET /files` every 8s via
  `XMLHttpRequest` (not `fetch`, for old-browser compatibility) and
  re-renders the file list without a full page reload. Upload and delete
  also go through `XMLHttpRequest`.
- `uploads/` — runtime storage for uploaded files. Everything in it is
  gitignored except `.gitkeep`; nothing uploaded through the app should
  ever be committed, since it may be arbitrary/sensitive user data.

## Security model

There is no authentication. Anyone on the same WiFi network can upload,
download, or delete any file served by this app. This is an accepted
tradeoff for a trusted-LAN tool, not an oversight — don't add auth unless
asked, but don't remove the filename sanitization in `/upload` or the
path-traversal guard in `/delete` either.

## Deployment target

The server is meant to run inside Termux on an Android phone, reached over
SSH for setup/administration. See `README.md` for the Termux-specific
commands (checking whether the server is running, keeping Termux awake
with `termux-wake-lock`, keeping the process alive in the background with
`tmux`).
