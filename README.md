# KlypVio

AI-powered video repurposing platform — web-first successor to the SOCL Visuals Studio desktop application.

## Current scope

This repository starts with the web foundation:

- React + TypeScript frontend
- Fastify API
- Worker boundary for long-running media/AI jobs
- Shared domain types
- Monorepo managed with pnpm
- UI shell for source import, pipeline state, clips, and editor-oriented navigation

The desktop application's processing behavior is the source of truth. Web-specific infrastructure will replace Electron IPC and local process execution while preserving workflow and output behavior.

## Development

Requirements:

- Node.js 22+
- pnpm 10+

Install:

```bash
pnpm install
```

Run all apps:

```bash
pnpm dev
```

Run frontend only:

```bash
pnpm --filter @klypvio/web dev
```

Run API only:

```bash
pnpm --filter @klypvio/api dev
```

## Architecture

```
Browser
  |
  v
Web UI
  |
  v
API
  |
  +--> PostgreSQL
  +--> Object Storage
  +--> Job Queue
           |
           +--> acquisition worker (yt-dlp)
           +--> transcription worker (Whisper)
           +--> media worker (FFmpeg)
           +--> AI orchestration
```

See `docs/ARCHITECTURE.md` for the current migration model.
