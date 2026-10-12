"use client";

import { useRef, useState } from "react";

export default function InviteCard({ userId }: { userId: number }) {
  const [shareUrl, setShareUrl] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const linkInput = useRef<HTMLInputElement>(null);
  const pending = useRef(false);

  async function getShareUrl() {
    const response = await fetch("/api/share-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || "Unable to get your share link. Please try again.");
    if (typeof data?.sharePath !== "string" || !/^\/share\/[0-9a-f]{64}$/.test(data.sharePath)) {
      throw new Error("The server returned an invalid share link.");
    }
    const url = new URL(data.sharePath, window.location.origin).href;
    setShareUrl(url);
    return url;
  }

  const handleCopy = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setStatus("Getting your share link…");
    const urlPromise = getShareUrl();
    // Begin clipboard access during the click, preserving Safari's user activation
    // while the server looks up or creates the stored token.
    let copied = false;
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({
          "text/plain": urlPromise.then(url => new Blob([url], { type: "text/plain" })),
        })]);
      } else {
        const url = await urlPromise;
        await navigator.clipboard.writeText(url);
      }
      copied = true;
    } catch {
      // Keep the retrieved link visible even if clipboard access is denied.
    }
    try {
      await urlPromise;
      if (!copied) {
        linkInput.current?.focus();
        linkInput.current?.select();
      }
      setStatus(copied ? "Share link copied to your clipboard." : "Your share link is ready. Copy the selected link manually; clipboard access was unavailable.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to get your share link.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <section className="dashboard-card invite-card" aria-labelledby="invite-heading">
      <div className="dashboard-card-heading">
        <span className="dashboard-card-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <path d="M11 16h10M16 11v10" />
            <circle cx="16" cy="16" r="12" />
          </svg>
        </span>
        <div>
          <p className="dashboard-kicker">Invite contributors</p>
          <h2 id="invite-heading">Share your family&apos;s dashboard</h2>
        </div>
      </div>

      <p className="dashboard-card-copy">
        Anyone with this link can view your storybooks and add memories without creating an account.
      </p>

      <div className="invite-control-row">
        <input
          ref={linkInput}
          aria-label="Dashboard share link"
          type="text"
          value={shareUrl}
          placeholder="Click Copy Link to get your share link"
          readOnly
        />
        <button className="button button-secondary dashboard-button" type="button" onClick={handleCopy} disabled={busy}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
          {busy ? "Getting link…" : "Copy Link"}
        </button>
      </div>

      <p className="invite-security-note">
        <span aria-hidden="true">◇</span>
        Anyone with this private link can view and contribute without logging in.
      </p>
      <p className="dashboard-status" aria-live="polite">{status}</p>

    </section>
  );
}
