import React from 'react';
import Logo from '../ui/Logo';

export default function RoomHeader({ roomCode, username, isHost, userCounts, onLeave }) {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          {userCounts && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-slow" />
              {userCounts.total}/{userCounts.maxTotal} online
            </span>
          )}

          {isHost && (
            <span className="tag bg-accent/10 border-accent/30 text-accent text-xs">
              👑 HOST
            </span>
          )}

          <span className="text-xs text-text-dim font-display hidden sm:block">
            {username}
          </span>

          <button
            onClick={onLeave}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            Leave
          </button>
        </div>
      </div>
    </header>
  );
}
