import React, { useState } from 'react';

export default function RoomCodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareUrl = `${window.location.origin}/room/${code}`;

  const handleShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="card">
      <p className="text-xs font-display text-muted uppercase tracking-wider mb-3">Room Code</p>

      {/* Big code display */}
      <div
        className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-subtle transition-colors group mb-3"
        onClick={handleCopy}
        title="Click to copy code"
      >
        <span className="font-display text-2xl tracking-[0.4em] text-text font-bold">{code}</span>
        <span className="text-xs text-muted font-display group-hover:text-text-dim transition-colors">
          {copied ? '✓ COPIED' : 'COPY'}
        </span>
      </div>

      {/* Share URL */}
      <button
        onClick={handleShareUrl}
        className="w-full text-left bg-surface border border-border rounded px-3 py-2 text-xs text-muted hover:border-subtle hover:text-text-dim transition-colors font-body truncate"
        title="Copy share link"
      >
        🔗 {shareUrl.replace('https://', '')}
      </button>

      <p className="text-xs text-muted mt-2 font-body">
        Share the code or link with friends to invite them.
      </p>
    </div>
  );
}
