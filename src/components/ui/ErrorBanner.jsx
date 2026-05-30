import React from 'react';

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm">
      <span className="text-accent mt-0.5 shrink-0">⚠</span>
      <span className="text-text flex-1 font-body">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-muted hover:text-text transition-colors shrink-0 font-display"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
