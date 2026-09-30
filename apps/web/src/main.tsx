import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const nav = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Projects", icon: "▣" },
  { label: "History", icon: "◷" },
  { label: "Settings", icon: "⚙" }
];

const clips = [
  { title: "The strongest hook is usually the first sentence", time: "00:42 — 01:18", score: "92", status: "Hot" },
  { title: "A simple editing change can double retention", time: "04:12 — 04:48", score: "88", status: "Ready" },
  { title: "How to structure a short-form story", time: "08:05 — 08:51", score: "84", status: "Ready" }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">K</div>
          <div>
            <div className="brand-name">KlypVio</div>
            <div className="brand-subtitle">AI video repurposing</div>
          </div>
        </div>

        <nav className="nav">
          {nav.map((item, index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} key={item.label}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="usage-label">Render usage</div>
          <div className="usage-bar"><span /></div>
          <div className="usage-meta">12 / 60 minutes</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">WORKSPACE</div>
            <h1>Turn long videos into shorts.</h1>
            <p>Analyze a source, discover clips, edit, and render from one workflow.</p>
          </div>
          <button className="profile">OA</button>
        </header>

        <section className="source-card">
          <div>
            <div className="section-kicker">NEW PROJECT</div>
            <h2>Add a video source</h2>
            <p>Paste a YouTube URL or upload a local source. Processing will run as a background job.</p>
          </div>
          <div className="source-actions">
            <input aria-label="Video URL" placeholder="https://youtube.com/watch?v=..." />
            <button className="primary">Analyze source</button>
          </div>
        </section>

        <section className="pipeline">
          <div className="section-header">
            <div>
              <div className="section-kicker">PIPELINE</div>
              <h2>Latest run</h2>
            </div>
            <span className="status-pill">Idle</span>
          </div>
          <div className="steps">
            {["Source", "Transcript", "AI analysis", "Clips", "Render"].map((step, i) => (
              <div className={i === 0 ? "step current" : "step"} key={step}>
                <span className="step-dot">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="clips">
          <div className="section-header">
            <div>
              <div className="section-kicker">CLIP DISCOVERY</div>
              <h2>Suggested clips</h2>
            </div>
            <button className="ghost">View all</button>
          </div>

          <div className="clip-grid">
            {clips.map((clip) => (
              <article className="clip-card" key={clip.title}>
                <div className="clip-preview">
                  <div className="play">▶</div>
                  <span className="clip-duration">{clip.time.split(" — ")[1]}</span>
                </div>
                <div className="clip-body">
                  <div className="clip-meta">
                    <span>{clip.status}</span>
                    <strong>{clip.score}</strong>
                  </div>
                  <h3>{clip.title}</h3>
                  <p>{clip.time}</p>
                  <button className="edit-button">Open editor</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
