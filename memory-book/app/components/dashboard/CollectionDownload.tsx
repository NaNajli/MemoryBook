"use client";

import { useState } from "react";

export function useCollectionDownload() {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(id: string) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  async function download() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/books/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Unable to download images. Please try again.");
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "memory-book-images.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to download images. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return { selecting, selected, busy, error, toggle, download,
    toggleSelecting() { setSelecting(!selecting); setSelected([]); setError(""); },
  };
}

export function CollectionDownloadActions({ state }: { state: ReturnType<typeof useCollectionDownload> }) {
  return (
    <div className="collection-download">
      <div className="collection-download-buttons">
        <button type="button" className="button button-secondary" aria-pressed={state.selecting} disabled={state.busy} onClick={state.toggleSelecting}>
          {state.selecting ? "Cancel selection" : "Select topics"}
        </button>
        <button type="button" className="button button-primary" disabled={state.busy} onClick={state.download}>
          {state.busy ? "Creating PDF…" : state.selected.length ? `Download selected (${state.selected.length}) as PDF` : "Download all images as PDF"}
        </button>
      </div>
      <p aria-live="polite">{state.selected.length ? `${state.selected.length} topics selected.` : "No topics selected. Your PDF will include all images."}</p>
      {state.error && <p role="alert">{state.error}</p>}
    </div>
  );
}