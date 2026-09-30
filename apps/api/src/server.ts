import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { pipelineQueue } from "./queue.js";

type Project = { id: string; name: string; createdAt: string; updatedAt: string };
type Source = { id: string; projectId: string; input: string; status: "pending" | "acquiring" | "ready" | "failed" };

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const projects = new Map<string, Project>();
const sources = new Map<string, Source>();

app.get("/health", async () => ({ name: "klypvio-api", status: "ok", version: "0.2.0" }));
app.get("/api/projects", async () => [...projects.values()]);

app.post<{ Body: { name?: string } }>("/api/projects", async (request, reply) => {
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    name: request.body.name?.trim() || "Untitled project",
    createdAt: now,
    updatedAt: now
  };
  projects.set(project.id, project);
  return reply.code(201).send(project);
});

app.get<{ Params: { projectId: string } }>("/api/projects/:projectId", async (request, reply) => {
  const project = projects.get(request.params.projectId);
  if (!project) return reply.code(404).send({ error: "PROJECT_NOT_FOUND" });
  return project;
});

app.post<{ Params: { projectId: string }; Body: { input?: string } }>("/api/projects/:projectId/sources", async (request, reply) => {
  if (!projects.has(request.params.projectId)) return reply.code(404).send({ error: "PROJECT_NOT_FOUND" });
  const input = request.body.input?.trim();
  if (!input) return reply.code(400).send({ error: "SOURCE_INPUT_REQUIRED" });
  const source: Source = { id: randomUUID(), projectId: request.params.projectId, input, status: "pending" };
  sources.set(source.id, source);
  return reply.code(201).send(source);
});

app.post<{ Body: { projectId?: string; sourceId?: string } }>("/api/pipeline-runs", async (request, reply) => {
  const { projectId, sourceId } = request.body;
  if (!projectId || !sourceId) return reply.code(400).send({ error: "PROJECT_AND_SOURCE_REQUIRED" });

  const project = projects.get(projectId);
  const source = sources.get(sourceId);
  if (!project || !source || source.projectId !== projectId) return reply.code(404).send({ error: "PROJECT_OR_SOURCE_NOT_FOUND" });

  try {
    const job = await pipelineQueue.add("analyze-source", { projectId, sourceId, input: source.input });
    return reply.code(201).send({
      id: job.id,
      projectId,
      sourceId,
      status: "queued",
      progress: 0,
      currentStep: "queued"
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(503).send({ error: "PIPELINE_QUEUE_UNAVAILABLE" });
  }
});

app.get<{ Params: { runId: string } }>("/api/pipeline-runs/:runId", async (request, reply) => {
  const job = await pipelineQueue.getJob(request.params.runId);
  if (!job) return reply.code(404).send({ error: "PIPELINE_RUN_NOT_FOUND" });

  const state = await job.getState();
  const progress = typeof job.progress === "number" ? job.progress : 0;
  const status = state === "active" ? "running" : state === "completed" ? "completed" : state === "failed" ? "failed" : state === "cancelled" ? "cancelled" : "queued";
  return { id: job.id, projectId: job.data.projectId, sourceId: job.data.sourceId, status, progress, currentStep: state };
});

const port = Number(process.env.PORT ?? 4000);
app.listen({ host: "0.0.0.0", port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
