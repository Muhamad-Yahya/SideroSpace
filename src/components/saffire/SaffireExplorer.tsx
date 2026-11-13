
"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import DataIntegrityPanel from "@/components/DataIntegrityPanel";
import ExperimentResearchContext, {
  ExperimentResearchSources,
} from "@/components/ExperimentResearchContext";
import { saffireResearchContent } from "@/lib/experiment-research-content";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  ExternalLink,
  Gauge,
  Maximize2,
  Pause,
  Play,
  Search,
  ShieldCheck,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Target,
  Waves,
  X,
} from "lucide-react";

type Frame = {
  frame: number;
  filename: string;
  timestampMs: number;
  timestampUtc: string;
};

const DATA_PATH = "/data/saffire/f1c1";

export default function SaffireExplorer() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Load the local SAFFIRE image manifest.
  useEffect(() => {
    let active = true;

    fetch(`${DATA_PATH}/manifest.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load the frame manifest.");
        }

        return response.json();
      })
      .then((data: Frame[]) => {
        if (!active) return;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("The manifest contains no frames.");
        }

        setFrames(data);
        const requestedFrame = new URLSearchParams(window.location.search).get(
          "frame"
        );
        if (requestedFrame && /^\d+$/.test(requestedFrame)) {
          const frameIndex = data.findIndex(
            (frame) => String(frame.frame).padStart(4, "0") === requestedFrame
          );
          if (frameIndex >= 0) setIndex(frameIndex);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load SAFFIRE data."
        );

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!showFullscreen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowFullscreen(false);
      if (event.key === "ArrowRight") {
        setIndex((currentIndex) =>
          Math.min(frames.length - 1, currentIndex + 1)
        );
      }
      if (event.key === "ArrowLeft") {
        setIndex((currentIndex) => Math.max(0, currentIndex - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFullscreen, frames.length]);

  // Frame-by-frame playback.
  useEffect(() => {
    if (!playing || frames.length === 0) return;

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => {
        if (currentIndex >= frames.length - 1) {
          setPlaying(false);
          return 0;
        }

        return currentIndex + 1;
      });
    }, 34 / Number(speed));

    return () => window.clearInterval(interval);
  }, [playing, speed, frames.length]);

  // Keep fullscreen state synchronized with browser controls.
  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
    };
  }, []);

  const current = frames[index];
  const firstTimestamp = frames[0]?.timestampMs ?? 0;

  const elapsed = current
    ? Math.max(0, (current.timestampMs - firstTimestamp) / 1000)
    : 0;

  const durationMs =
    (frames.at(-1)?.timestampMs ?? firstTimestamp) - firstTimestamp;

  const durationSeconds = durationMs >= 0 ? durationMs / 1000 : 0;

  const togglePlayback = useCallback(() => {
    if (frames.length === 0) return;

    if (index >= frames.length - 1) {
      setIndex(0);
    }

    setPlaying((value) => !value);
  }, [index, frames.length]);

  const goTo = (nextIndex: number) => {
    setIndex(Math.max(0, Math.min(frames.length - 1, nextIndex)));
  };

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await viewerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setShowInfo(true);
    }
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = (safeSeconds % 60).toFixed(2).padStart(5, "0");

    return `${String(minutes).padStart(2, "0")}:${remainder}`;
  };

  return (
    <main className="fl-shell">
      <section className="main-area" id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>SAFFIRE-I experiment</strong>
          </div>

          <div className="topbar-right">
            <span className="environment">
              <span />
              DATA CONNECTED
            </span>

            <button
              className="icon-button"
              aria-label="About this preview"
              onClick={() => setShowInfo((value) => !value)}
            >
              <CircleHelp size={18} />
            </button>

            <div className="avatar">SS</div>
          </div>
        </header>

        <div className="content">
          {/* Page heading */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                NASA SPACECRAFT FIRE SAFETY EXPERIMENT
              </div>

              <h1>
                SAFFIRE-I <span>Experiment.</span>
              </h1>

              <p className="heading-description">
                Review the documented objectives and test context, then inspect
                the available F1C1 pre-test flow-visualization sequence.
              </p>
            </div>

            <a
              className="source-button"
              href="https://psi.nasa.gov/physci/repo/data/investigations/PSI-98"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} />
              NASA PSI-98 record
              <ArrowUpRight size={14} />
            </a>
          </div>

          {showInfo && (
            <div className="notice">
              <CircleHelp size={18} />

              <div>
                <strong>About this preview</strong>
                <p>
                  This is a local prototype. The frame count and
                  resolution were checked against your downloaded
                  archive. No flame measurements or AI-generated
                  scientific conclusions are presented.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowInfo(false)}
                aria-label="Close information"
              >
                ×
              </button>
            </div>
          )}

          {/* Overview statistics */}
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>IMAGE SEQUENCE</span>
                <span className="stat-icon purple">
                  <Database size={17} />
                </span>
              </div>

              <div className="stat-value">
                {loading ? "—" : frames.length.toLocaleString()}
                <small> frames</small>
              </div>

              <div className="stat-foot">
                <span className="foot-dot purple-dot" />
                SAFFIRE-I · F1C1
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>SEQUENCE DURATION</span>
                <span className="stat-icon orange">
                  <Clock3 size={17} />
                </span>
              </div>

              <div className="stat-value">
                {loading ? "—" : durationSeconds.toFixed(2)}
                <small> sec</small>
              </div>

              <div className="stat-foot">
                <span className="foot-dot orange-dot" />
                First-to-last filename timestamp
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>IMAGE RESOLUTION</span>
                <span className="stat-icon blue">
                  <Target size={17} />
                </span>
              </div>

              <div className="stat-value">
                1280 <small>× 920 px</small>
              </div>

              <div className="stat-foot">
                <span className="foot-dot blue-dot" />
                Original JPEG dimensions verified
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>DATA STATUS</span>
                <span className="stat-icon green">
                  <ShieldCheck size={17} />
                </span>
              </div>

              <div className="stat-value status-value">
                {loading ? "Loading" : error ? "Error" : "Available"}
              </div>

              <div className="stat-foot">
                <span
                  className={`foot-dot ${
                    error ? "orange-dot" : "green-dot"
                  }`}
                />
                {error
                  ? "Manifest needs attention"
                  : "Local dataset manifest"}
              </div>
            </article>
          </div>

          {/* Explorer heading */}
          <div className="section-heading" id="explorer">
            <div>
              <div className="section-kicker">
                EXPERIMENT VISUALIZATION
              </div>

              <h2>SAFFIRE frame explorer</h2>

              <p>Navigate the original camera sequence frame by frame.</p>
            </div>

            <div className="sequence-chip">
              <span className="live-dot" />
              SEQUENCE F1C1
            </div>
          </div>

          {/* Viewer and right sidebar */}
          <div className="explorer-grid">
            <section className="viewer-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-icon">
                    <Waves size={16} />
                  </span>

                  <div>
                    <strong>Camera feed</strong>
                    <small>SAFFIRE-I · F1C1</small>
                  </div>
                </div>

                <div className="feed-status">
                  <span />
                  SOURCE IMAGE
                </div>
              </div>

              <div
                className={`image-stage ${
                  fullscreen ? "fullscreen-stage" : ""
                }`}
                ref={viewerRef}
              >
                <div className="image-overlay top-left">
                  <span className="record-dot" />
                  ORIGINAL JPEG
                </div>

                <div className="image-overlay top-right">
                  {current
                    ? `FRAME ${String(current.frame).padStart(4, "0")}`
                    : "INITIALIZING"}
                </div>

                {loading ? (
                  <div className="image-placeholder">
                    <div className="loading-ring" />
                    <span>Loading frame manifest…</span>
                  </div>
                ) : error ? (
                  <div className="image-placeholder error-message">
                    <CircleHelp size={28} />
                    <strong>Unable to load the dataset</strong>
                    <span>{error}</span>
                    <span>
                      Check that public/data/saffire/f1c1/manifest.json
                      exists.
                    </span>
                  </div>
                ) : current ? (
                  <img
                    className="flame-image"
                    src={`${DATA_PATH}/${encodeURIComponent(
                      current.filename
                    )}`}
                    alt={`SAFFIRE-I camera F1C1, frame ${current.frame}`}
                    draggable={false}
                  />
                ) : null}

                <div className="image-overlay bottom-left">
                  <span className="crosshair">+</span>
                  F1C1 / SAFFIRE-I
                </div>

                <button
                  className="fullscreen-button"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  className="fullscreen-button viewer-lightbox-button"
                  onClick={() => setShowFullscreen(true)}
                  aria-label="Open frame in fullscreen viewer"
                >
                  <ExternalLink size={16} />
                </button>
              </div>

              {/* Playback controls */}
              <div className="playback-controls">
                <div className="playback-main">
                  <button
                    className="control-button"
                    aria-label="First frame"
                    onClick={() => {
                      setPlaying(false);
                      goTo(0);
                    }}
                    disabled={!frames.length}
                  >
                    <SkipBack size={17} />
                  </button>

                  <button
                    className="control-button"
                    aria-label="Previous frame"
                    onClick={() => {
                      setPlaying(false);
                      goTo(index - 1);
                    }}
                    disabled={!frames.length || index === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    className="play-button"
                    onClick={togglePlayback}
                    disabled={!frames.length}
                    aria-label={
                      playing ? "Pause playback" : "Play sequence"
                    }
                  >
                    {playing ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                  </button>

                  <button
                    className="control-button"
                    aria-label="Next frame"
                    onClick={() => {
                      setPlaying(false);
                      goTo(index + 1);
                    }}
                    disabled={
                      !frames.length || index === frames.length - 1
                    }
                  >
                    <ChevronRight size={20} />
                  </button>

                  <button
                    className="control-button"
                    aria-label="Last frame"
                    onClick={() => {
                      setPlaying(false);
                      goTo(frames.length - 1);
                    }}
                    disabled={!frames.length}
                  >
                    <SkipForward size={17} />
                  </button>
                </div>

                <div className="speed-control">
                  <Gauge size={15} />
                  <span>Speed</span>

                  <select
                    value={speed}
                    onChange={(event) => setSpeed(event.target.value)}
                    aria-label="Playback speed"
                  >
                    <option value="0.25">0.25×</option>
                    <option value="0.5">0.5×</option>
                    <option value="1">1×</option>
                    <option value="2">2×</option>
                    <option value="4">4×</option>
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline-block">
                <div className="timeline-labels">
                  <span>FRAME TIMELINE</span>
                  <span>
                    {frames.length
                      ? `${index + 1} / ${frames.length}`
                      : "—"}
                  </span>
                </div>

                <input
                  className="timeline-slider"
                  aria-label="Seek frame"
                  type="range"
                  min={0}
                  max={Math.max(0, frames.length - 1)}
                  value={index}
                  onChange={(event) => {
                    setPlaying(false);
                    goTo(Number(event.target.value));
                  }}
                  disabled={!frames.length}
                  style={
                    {
                      "--progress": `${
                        frames.length > 1
                          ? (index / (frames.length - 1)) * 100
                          : 0
                      }%`,
                    } as CSSProperties
                  }
                />

                <div className="timeline-labels timeline-times">
                  <span>00:00.00</span>
                  <span>Elapsed from first frame: {formatTime(elapsed)}</span>
                  <span>
                    {frames.length ? formatTime(durationSeconds) : "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Right-side frame information */}
            <aside className="details-column">
              <section className="detail-card">
                <div className="detail-heading">
                  <div>
                    <span className="section-kicker">FRAME METADATA</span>
                    <h3>Current frame</h3>
                  </div>

                  <SlidersHorizontal size={17} />
                </div>

                {current ? (
                  <>
                    <div className="frame-number">
                      <span>FRAME</span>
                      <strong>
                        {String(current.frame).padStart(4, "0")}
                      </strong>
                      <span className="frame-total">/ {frames.length}</span>
                    </div>

                    <div className="detail-row">
                      <span>Camera</span>
                      <strong>F1C1</strong>
                    </div>

                    <div className="detail-row">
                      <span>Filename</span>
                      <strong className="filename">
                        {current.filename}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>Sequence offset</span>
                      <strong>{elapsed.toFixed(3)} s</strong>
                    </div>

                    <div className="detail-row">
                      <span>Timestamp (UTC)</span>
                      <strong className="utc-value">
                        {current.timestampUtc
                          ? new Date(current.timestampUtc)
                              .toISOString()
                              .replace("T", " ")
                              .replace("Z", " UTC")
                          : "—"}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>Image dimensions</span>
                      <strong>1280 × 920</strong>
                    </div>
                  </>
                ) : (
                  <div className="detail-empty">
                    Waiting for frame data…
                  </div>
                )}
              </section>

              {current && (
                <a
                  className="obs-download saffire-current-download"
                  href={`${DATA_PATH}/${encodeURIComponent(current.filename)}`}
                  download={current.filename}
                >
                  <ArrowDownToLine size={15} />
                  Download current image
                </a>
              )}

              <section className="integrity-card">
                <div className="integrity-title">
                  <ShieldCheck size={17} />
                  <strong>Data integrity</strong>
                  <span className="verified-pill">LOCAL</span>
                </div>

                <p>
                  Displaying original JPEG files from your downloaded
                  SAFFIRE-I archive. No synthetic frames are used.
                </p>

                <div className="integrity-metric">
                  <span>Manifest records</span>
                  <strong>{loading ? "…" : frames.length}</strong>
                </div>

                <div className="integrity-metric">
                  <span>Selected sequence</span>
                  <strong>F1C1</strong>
                </div>
              </section>
            </aside>
          </div>

          <DataIntegrityPanel />

          {/* Single research strip */}
          <section className="bottom-strip" id="research">
            <div className="bottom-strip-icon">
              <Search size={17} />
            </div>

            <div>
              <strong>Explore the evidence, not assumptions.</strong>

              <p>
                Frame browsing is available now. Flame measurements,
                event labels, and experiment conclusions will require
                separate validation.
              </p>
            </div>

            <span className="prototype-badge">PROTOTYPE</span>
          </section>

          <ExperimentResearchContext
            content={saffireResearchContent}
            showSources={false}
          />

          <ExperimentResearchSources content={saffireResearchContent} />

          <footer className="footer">
            <span>
              SideroSpace <span className="footer-separator">/</span> NASA
              SPACE APPS PROJECT
            </span>

            <span>SAFFIRE-I · F1C1 · LOCAL DATASET</span>
          </footer>
        </div>
      </section>

      {showFullscreen && current && (
        <div
          className="obs-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen frame viewer"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            className="obs-lightbox-close"
            onClick={() => setShowFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X size={22} />
          </button>
          <button
            className="obs-lightbox-arrow obs-lightbox-left"
            onClick={(event) => {
              event.stopPropagation();
              goTo(index - 1);
            }}
            disabled={index === 0}
            aria-label="Previous frame"
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={`${DATA_PATH}/${encodeURIComponent(current.filename)}`}
            alt={current.filename}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            className="obs-lightbox-arrow obs-lightbox-right"
            onClick={(event) => {
              event.stopPropagation();
              goTo(index + 1);
            }}
            disabled={index >= frames.length - 1}
            aria-label="Next frame"
          >
            <ChevronRight size={22} />
          </button>
          <div className="obs-lightbox-caption">{current.filename}</div>
        </div>
      )}
    </main>
  );
}
