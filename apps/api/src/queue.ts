import { Queue } from "bullmq";

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

export const pipelineQueue = new Queue("klypvio-pipeline", {
  connection: redisConnection(),
  defaultJobOptions: { attempts: 1, removeOnComplete: 100, removeOnFail: 100 }
});
