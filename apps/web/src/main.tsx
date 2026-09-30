import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import type { PipelineRun, Project } from "@klypvio/shared";
import { api } from "./api";
import "./styles.css";

const nav = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Projects", icon: "▣" },
  { label: "History", icon: "◷" },
  { label: "Settings", icon: "⚙" }
];

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [source, setSource] = useState("");
  const [run, setRun] = useState<PipelineRun | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    if (!run || run.status === "completed" || run.status === "failed" || run.status === "cancelled") return;
    const timer = window.setInterval(() => {
      api.getPipeline(run.id).then(setRun).catch(() => undefined);
    }, 1200);
    return () => window.clearInterval(timer);
  }, [run]);

  const pipelineLabel = useMemo(() => {
    if (!run) return "Idle";
    if (run.status === "queued") return "Queued";
    if (run.status === "running") return `${run.progress}% running`;
    return run.status[0].toUpperCase() + run.status.slice(1);
  }, [run]);

  async function analyzeSource() {
    const input = source.trim();
    if (!input || busy) return;
    setBusy(true);
    setError(null);

    try {
      const project = await api.createProject(`Project ${new Date().toLocaleString()}`);
      setProjects((items) => [project, ...items]);
      const createdSource = await api.createSource(project.id, input);
      const started = await api.startPipeline(project.id, createdSource.id);
      setRun(started);
      setSource("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "REQUEST_FAILED");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">K</div>
          <div><div className="brand-name">KlypVio</div><div className="brand-subtitle">AI video repurposing</div></div>
        </div>
        <nav className="nav">
          {nav.map((item, index) => <button className={index === 0 ? "nav-item active" : "nav-item"} key={item.label}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-footer">
          <div className="usage-label">Projects</div>
          <div className="usage-meta">{projects.length} created in this workspace</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><div className="eyebrow">WORKSPACE</div><h1>Turn long videos into shorts.</h1><p>Analyze a source, discover clips, edit, and render from one workflow.</p></div>
          <button className="profile">KV</button>
        </header>

        <section className="source-card">
          <div><div className="section-kicker">NEW PROJECT</div><h2>Add a video source</h2><p>Paste a YouTube URL or a supported source. Processing runs as a background job.</p></div>
          <div className="source-actions">
            <input aria-label="Video URL" value={source} onChange={(event) => setSource(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void analyzeSource(); }} placeholder="https://youtube.com/watch?v=..." />
            <button className="primary" disabled={busy || !source.trim()} onClick={() => void analyzeSource()}>{busy ? "Starting…" : "Analyze source"}</button>
          </div>
          {error && <div className="notice error">{error}</div>}
        </section>

        <section className="pipeline">
          <div className="section-header"><div><div className="section-kicker">PIPELINE</div><h2>Latest run</h2></div><span className="status-pill">{pipelineLabel}</span></div>
          <div className="steps">
            {["Source", "Transcript", "AI analysis", "Clips", "Render"].map((step, i) => <div className={i === 0 ? "step current" : "step"} key={step}><span className="step-dot">{i + 1}</span><span>{step}</span></div>)}
          </div>
          {run && <div className="run-detail"><span>Job {run.id}</span><strong>{run.progress}%</strong></div>}
        </section>

        <section className="clips">
          <div className="section-header"><div><div className="section-kicker">CLIP DISCOVERY</div><h2>Suggested clips</h2></div><button className="ghost">View all</button></div>
          <div className="empty-card"><div className="empty-title">No clips yet</div><p>Clip detection will populate this area once the acquisition, transcription, and AI stages are connected.</p></div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
