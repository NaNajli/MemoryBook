"use client";

import { FormEvent, useState } from "react";

type InviteCardProps = {
  shareUrl?: string;
};

export default function InviteCard({ shareUrl }: InviteCardProps) {
  const [status, setStatus] = useState("");
  const sharingAvailable = Boolean(shareUrl);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shareUrl) {
      setStatus("Secure sharing will be available after authentication and share tokens are connected.");
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) {
      setStatus("Secure sharing will be available after authentication and share tokens are connected.");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Share link copied to your clipboard.");
    } catch {
      setStatus("The link could not be copied. Please copy it manually.");
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
        Invite someone to view the shared dashboard without creating an account. Secure,
        revocable access will be provided by a private share link.
      </p>

      <form className="invite-form" onSubmit={handleSend}>
        <label htmlFor="invite-email">Send by email</label>
        <div className="invite-control-row">
          <input
            id="invite-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="family@example.com"
            required
          />
          <button className="button dashboard-button" type="submit">
            Send Link
          </button>
        </div>
      </form>

      <div className="invite-divider"><span>or copy the private link</span></div>

      <div className="invite-control-row">
        <input
          aria-label="Private dashboard share link"
          type="text"
          value={shareUrl ?? "Secure link available after account integration"}
          readOnly
        />
        <button className="button button-secondary dashboard-button" type="button" onClick={handleCopy}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
          Copy Link
        </button>
      </div>

      <p className="invite-security-note">
        <span aria-hidden="true">◇</span>
        Only people with a valid link will be able to view the shared dashboard.
      </p>
      <p className="dashboard-status" aria-live="polite">{status}</p>
      {!sharingAvailable && (
        <p className="integration-note">
          Share delivery is safely inactive until authentication and server-issued share tokens are connected.
        </p>
      )}
    </section>
  );
}
