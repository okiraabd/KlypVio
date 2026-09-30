# KlypVio Web Architecture

## Migration principles

1. Preserve desktop workflow and business behavior.
2. Move OS-bound work behind backend services/workers.
3. Keep media processing server-side with FFmpeg.
4. Make long-running work durable and observable.
5. Keep provider credentials server-side.

## Desktop to web

| Desktop | Web |
| --- | --- |
| Electron renderer | React frontend |
| Electron IPC | HTTP API + SSE/WebSocket |
| local filesystem | object storage / server workspace |
| FFmpeg process | media worker |
| yt-dlp process | acquisition worker |
| Whisper/local transcription | transcription worker |
| AI provider calls | backend AI service |
| local history/session state | database |
| machine-bound licensing | account/entitlement service |

## Core domain

User -> Project -> Source -> PipelineRun -> Clip -> Edit -> RenderJob -> RenderedAsset

The UI should be driven by durable server state rather than browser-only state for processing jobs.

## Initial API boundaries

- `/health`
- `/api/projects`
- `/api/sources`
- `/api/pipeline-runs`
- `/api/clips`
- `/api/render-jobs`

These are intentionally small at the foundation stage. Implement real behavior behind them incrementally instead of creating fake endpoints for unsupported functionality.
