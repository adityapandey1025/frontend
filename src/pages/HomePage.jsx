import React, { useState, useEffect } from 'react';
import { useRoom } from '../context/RoomContext';
import { useSocket } from '../hooks/useSocket';
import { detectDeviceType } from '../utils/helpers';
import Logo from '../components/ui/Logo';
import ErrorBanner from '../components/ui/ErrorBanner';

const TAB = { CREATE: 'create', JOIN: 'join' };

export default function HomePage() {
  const { state, clearError } = useRoom();
  const { createRoom, joinRoom } = useSocket();

  const [tab, setTab] = useState(TAB.CREATE);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const deviceType = detectDeviceType();

  // Clear error when switching tabs
  useEffect(() => { clearError(); }, [tab, clearError]);

  // Handle server errors to stop loading
  useEffect(() => {
    if (state.error) setLoading(false);
  }, [state.error]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    clearError();
    createRoom({ username: username.trim(), deviceType });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomCode.trim()) return;
    setLoading(true);
    clearError();
    joinRoom({ username: username.trim(), deviceType, roomCode: roomCode.trim().toUpperCase() });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(230,59,111,0.12) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo size="lg" />
          <p className="mt-3 text-text-dim text-sm font-body text-center max-w-xs">
            Watch YouTube together. Perfectly in sync.<br />
            <span className="text-muted text-xs">Up to 15 friends · Zero drift</span>
          </p>
        </div>

        {/* Error */}
        {state.error && (
          <div className="mb-4 animate-fade-in">
            <ErrorBanner message={state.error} onClose={clearError} />
          </div>
        )}

        {/* Card */}
        <div className="card">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-border">
            {[TAB.CREATE, TAB.JOIN].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-3 font-display text-sm uppercase tracking-widest transition-colors duration-150 ${
                  tab === t
                    ? 'text-accent border-b-2 border-accent -mb-px'
                    : 'text-muted hover:text-text-dim'
                }`}
              >
                {t === TAB.CREATE ? 'Create Room' : 'Join Room'}
              </button>
            ))}
          </div>

          {/* Forms */}
          {tab === TAB.CREATE ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-display text-muted uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  autoFocus
                  required
                />
              </div>

              <DeviceInfo deviceType={deviceType} />

              <button
                type="submit"
                className="btn-primary w-full mt-2"
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  '+ Create Room'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-display text-muted uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-display text-muted uppercase tracking-wider mb-2">
                  Room Code
                </label>
                <input
                  className="input-field font-display tracking-[0.3em] text-center uppercase text-lg"
                  placeholder="A B C 1 2 3"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>

              <DeviceInfo deviceType={deviceType} />

              <button
                type="submit"
                className="btn-lime w-full mt-2"
                disabled={loading || !username.trim() || roomCode.length !== 6}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  '→ Join Room'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted text-xs mt-6 font-display">
          SYNCMUSIC · REAL-TIME WATCH PARTY
        </p>
      </div>
    </div>
  );
}

function DeviceInfo({ deviceType }) {
  return (
    <div className="flex items-center gap-2">
      <span className="tag">
        <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />
        {deviceType === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
      </span>
      <span className="text-xs text-muted">
        {deviceType === 'mobile' ? 'Mobile slot (max 5)' : 'Desktop slot (max 10)'}
      </span>
    </div>
  );
}
