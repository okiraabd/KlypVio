export type Id = string;

export type PipelineStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface Project {
  id: Id;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceVideo {
  id: Id;
  projectId: Id;
  input: string;
  title?: string;
  durationSeconds?: number;
  status: "pending" | "acquiring" | "ready" | "failed";
}

export interface PipelineRun {
  id: Id;
  projectId: Id;
  sourceId: Id;
  status: PipelineStatus;
  progress: number;
  currentStep?: string;
  error?: string;
}

export interface Clip {
  id: Id;
  projectId: Id;
  startSeconds: number;
  endSeconds: number;
  title?: string;
  hook?: string;
  description?: string;
  status: "detected" | "selected" | "rendering" | "rendered";
}

export interface RenderJob {
  id: Id;
  projectId: Id;
  clipId?: Id;
  status: PipelineStatus;
  progress: number;
  outputUrl?: string;
  error?: string;
}
