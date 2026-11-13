
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type AuditReport = {
  generated_at_utc: string;
  scope: string;
  summary: {
    manifest_unique_filenames: number;
    local_f1c1_files: number;
    inventory_f1c1_unique_files: number;
    inventory_f1c1_missing_on_disk: number;
    manifest_entries_missing_on_disk: number;
    disk_f1c1_files_missing_from_manifest: number;
    inventory_size_mismatches: number;
    local_jpeg_signature_or_end_marker_flags: number;
    inventory_marked_corrupt: number;
    separately_listed_as_corrupt: number;
  };
  details: {
    inventory_missing_on_disk: string[];
    separately_listed_as_corrupt: string[];
    size_mismatches: {
      filename: string;
      inventory_bytes: number;
      local_bytes: number;
    }[];
  };
  limitations: string[];
};

export default function DataIntegrityPanel() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch("/data/saffire/f1c1/integrity-report.json")
      .then((response) => {
        if (!response.ok) throw new Error("Audit report unavailable");
        return response.json();
      })
      .then((data: AuditReport) => setReport(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <section className="integrity-panel">
        <p className="integrity-eyebrow">DATA QUALITY / SAFFIRE-I</p>
        <h2>Integrity report unavailable</h2>
        <p>
          Run the local audit script to generate the report, then refresh this
          page.
        </p>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="integrity-panel" aria-live="polite">
        <p className="integrity-eyebrow">DATA QUALITY / SAFFIRE-I</p>
        <h2>Loading integrity report…</h2>
      </section>
    );
  }

  const s = report.summary;

  const hasDiscrepancies =
    s.inventory_f1c1_missing_on_disk > 0 ||
    s.manifest_entries_missing_on_disk > 0 ||
    s.disk_f1c1_files_missing_from_manifest > 0 ||
    s.inventory_size_mismatches > 0 ||
    s.local_jpeg_signature_or_end_marker_flags > 0;

  const overlapVerified =
    s.inventory_f1c1_missing_on_disk ===
      s.separately_listed_as_corrupt &&
    s.inventory_f1c1_missing_on_disk ===
      report.details.inventory_missing_on_disk.filter((name) =>
        report.details.separately_listed_as_corrupt.includes(name)
      ).length;

  return (
    <section className="integrity-panel" id="data-integrity">
      <div className="integrity-heading">
        <div>
          <p className="integrity-eyebrow">DATA QUALITY / SAFFIRE-I</p>
          <h2>Dataset integrity</h2>
          <p className="integrity-description">
            Local F1C1 image sequence cross-checked against the source
            inventory and manifest.
          </p>
        </div>

        <div
          className={`integrity-status ${
            hasDiscrepancies ? "is-review" : "is-clean"
          }`}
        >
          {hasDiscrepancies ? (
            <AlertTriangle size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          {hasDiscrepancies ? "Review required" : "Checks passed"}
        </div>
      </div>

      <div className="integrity-metrics">
        <article className="integrity-metric">
          <FileCheck2 size={19} />
          <span>Local images</span>
          <strong>{s.local_f1c1_files}</strong>
          <small>Manifest entries matched</small>
        </article>

        <article className="integrity-metric">
          <CheckCircle2 size={19} />
          <span>Size mismatches</span>
          <strong>{s.inventory_size_mismatches}</strong>
          <small>Compared with inventory</small>
        </article>

        <article className="integrity-metric">
          <Activity size={19} />
          <span>JPEG marker flags</span>
          <strong>{s.local_jpeg_signature_or_end_marker_flags}</strong>
          <small>Basic marker check only</small>
        </article>

        <article className="integrity-metric">
          <AlertTriangle size={19} />
          <span>Excluded entries</span>
          <strong>{s.inventory_f1c1_missing_on_disk}</strong>
          <small>Listed as corrupt in inventory</small>
        </article>
      </div>

      <div className="integrity-verification">
        <CheckCircle2 size={18} />
        <div>
          <strong>
            {overlapVerified
              ? "Missing-file discrepancy reconciled"
              : "Inventory discrepancy needs review"}
          </strong>
          <p>
            {overlapVerified
              ? `${s.inventory_f1c1_missing_on_disk} entries missing locally match the separately listed corrupt-file entries by filename.`
              : "The missing-file count and corrupt-list overlap do not fully agree. Inspect the detailed report."}
          </p>
        </div>
      </div>

      <button
        className="integrity-details-button"
        type="button"
        onClick={() => setShowDetails((current) => !current)}
        aria-expanded={showDetails}
      >
        {showDetails ? "Hide audit details" : "Inspect audit details"}
        <span>{showDetails ? "−" : "+"}</span>
      </button>

      {showDetails && (
        <div className="integrity-details">
          <h3>Cross-check summary</h3>
          <ul>
            <li>
              Manifest entries: <strong>{s.manifest_unique_filenames}</strong>
            </li>
            <li>
              Inventory F1C1 entries:{" "}
              <strong>{s.inventory_f1c1_unique_files}</strong>
            </li>
            <li>
              Manifest entries missing from disk:{" "}
              <strong>{s.manifest_entries_missing_on_disk}</strong>
            </li>
            <li>
              Local files absent from manifest:{" "}
              <strong>{s.disk_f1c1_files_missing_from_manifest}</strong>
            </li>
            <li>
              Entries listed as corrupt:{" "}
              <strong>{s.separately_listed_as_corrupt}</strong>
            </li>
          </ul>

          <h3>Audit limitations</h3>
          <ul>
            {report.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>

          <p className="integrity-timestamp">
            Audit generated:{" "}
            {new Date(report.generated_at_utc).toLocaleString()}
          </p>
        </div>
      )}
    </section>
  );
}
