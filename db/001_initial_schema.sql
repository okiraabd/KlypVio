create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists source_videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  input text not null,
  title text,
  duration_seconds numeric,
  status text not null default 'pending' check (status in ('pending', 'acquiring', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  source_id uuid not null references source_videos(id) on delete cascade,
  queue_job_id text,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress integer not null default 0 check (progress between 0 and 100),
  current_step text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  start_seconds numeric not null,
  end_seconds numeric not null,
  title text,
  hook text,
  description text,
  status text not null default 'detected' check (status in ('detected', 'selected', 'rendering', 'rendered')),
  created_at timestamptz not null default now()
);

create table if not exists render_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  clip_id uuid references clips(id) on delete set null,
  queue_job_id text,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress integer not null default 0 check (progress between 0 and 100),
  output_url text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists source_videos_project_idx on source_videos(project_id);
create index if not exists pipeline_runs_project_idx on pipeline_runs(project_id);
create index if not exists clips_project_idx on clips(project_id);
create index if not exists render_jobs_project_idx on render_jobs(project_id);
