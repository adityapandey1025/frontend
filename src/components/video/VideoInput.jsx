import React, { useState } from 'react';
import { extractVideoId } from '../../utils/helpers';

export default function VideoInput({ onSubmit, currentUrl }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    const id = extractVideoId(trimmed);
    if (!id) {
      setError('Invalid YouTube URL. Try: https://youtube.com/watch?v=...');
      return;
    }

    setError('');
    onSubmit(trimmed);
    setUrl('');
  };

  return (
    <div className="card">
      <p className="text-xs font-display text-muted uppercase tracking-wider mb-3">
        Queue Video
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(''); }}
        />
        <button
          type="submit"
          className="btn-accent shrink-0 bg-accent text-white font-display text-sm font-bold px-4 py-3 rounded hover:bg-accent/90 active:scale-[0.97] transition-all"
          disabled={!url.trim()}
        >
          ▶
        </button>
      </form>

      {error && (
        <p className="text-xs text-accent mt-2 font-body">{error}</p>
      )}

      {currentUrl && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted font-display shrink-0">NOW:</span>
          <span className="text-xs text-text-dim font-body truncate">{currentUrl}</span>
        </div>
      )}
    </div>
  );
}
