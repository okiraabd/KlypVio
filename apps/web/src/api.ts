import type { PipelineRun, Project, SourceVideo } from "@klypvio/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API_URL + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? response.statusText);
  }

  return response.json() as Promise<T>;
}

export const api = {
  listProjects: () => request<Project[]>("/api/projects"),
  createProject: (name: string) => request<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name })
  }),
  createSource: (projectId: string, input: string) => request<SourceVideo>(`/api/projects/${projectId}/sources`, {
    method: "POST",
    body: JSON.stringify({ input })
  }),
  startPipeline: (projectId: string, sourceId: string) => request<PipelineRun>("/api/pipeline-runs", {
    method: "POST",
    body: JSON.stringify({ projectId, sourceId })
  }),
  getPipeline: (runId: string) => request<PipelineRun>(`/api/pipeline-runs/${runId}`)
};
