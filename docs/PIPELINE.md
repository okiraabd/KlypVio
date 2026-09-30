# Pipeline implementation boundary

The web foundation now has a real Redis-backed queue and worker lifecycle. It intentionally does not fabricate transcript, AI, clip, or render output.

Target flow:

1. Source acquisition
2. Transcript resolution
3. AI analysis
4. Clip detection/scoring
5. Metadata generation
6. User editing
7. FFmpeg render
8. Stored output

Current worker stages stop after validating the source payload and proving queue execution. Real media stages must be implemented against the desktop application's existing behavior.

Next implementation: source acquisition with yt-dlp, then transcript resolution.
