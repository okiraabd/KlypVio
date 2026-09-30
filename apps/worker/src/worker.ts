import { Worker } from "bullmq";

function redisConnection() {
  const url = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    ...(url.protocol === "rediss:" ? { tls: {} } : {})
  };
}

const worker = new Worker(
  "klypvio-pipeline",
  async (job) => {
    const { projectId, sourceId, input } = job.data as {
      projectId: string;
      sourceId: string;
      input: string;
    };

    if (!input.trim()) {
      throw new Error("SOURCE_INPUT_REQUIRED");
    }

    await job.updateProgress(10);
    // Real yt-dlp, transcription, AI, and FFmpeg stages plug into this boundary.
    // Do not fabricate clip or render output.
    await job.updateProgress(25);

    return {
      projectId,
      sourceId,
      state: "pipeline-foundation-reached",
      message: "Queue, job lifecycle, and processing boundary are active."
    };
  },
  { connection: redisConnection(), concurrency: 2 }
);

worker.on("completed", (job) => console.log("[worker] completed", job.id));
worker.on("failed", (job, error) => console.error("[worker] failed", job?.id, error));

console.log("[worker] KlypVio pipeline worker started");
