import React from 'react';

export default function UserList({ users = [], userCounts, hostSocketId, currentUsername }) {
  const desktop = users.filter((u) => u.deviceType === 'desktop');
  const mobile = users.filter((u) => u.deviceType === 'mobile');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-display text-muted uppercase tracking-wider">Participants</p>
        {userCounts && (
          <span className="tag text-xs">
            {userCounts.total} / {userCounts.maxTotal}
          </span>
        )}
      </div>

      {/* Capacity bars */}
      {userCounts && (
        <div className="space-y-2 mb-4">
          <CapacityBar
            label="Desktop"
            current={userCounts.desktop}
            max={userCounts.maxDesktop}
            color="accent"
          />
          <CapacityBar
            label="Mobile"
            current={userCounts.mobile}
            max={userCounts.maxMobile}
            color="lime"
          />
        </div>
      )}

      {/* User list */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {users.length === 0 && (
          <p className="text-xs text-muted font-body py-2">No users connected.</p>
        )}
        {users.map((user, i) => (
          <UserRow
            key={user.socketId || i}
            user={user}
            isHost={user.socketId === hostSocketId}
            isMe={user.username === currentUsername}
          />
        ))}
      </div>
    </div>
  );
}

function CapacityBar({ label, current, max, color }) {
  const pct = Math.min((current / max) * 100, 100);
  const colorMap = { accent: 'bg-accent', lime: 'bg-lime' };
  return (
    <div>
      <div className="flex justify-between text-xs font-display text-muted mb-1">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="h-1 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function UserRow({ user, isHost, isMe }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface/50 transition-colors group">
      {/* Avatar */}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display
        ${isHost ? 'bg-accent/20 text-accent' : 'bg-surface border border-border text-text-dim'}`}>
        {user.username.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <span className="text-sm font-body text-text flex-1 truncate">
        {user.username}
        {isMe && <span className="text-muted text-xs ml-1">(you)</span>}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1 shrink-0">
        {isHost && <span className="text-xs">👑</span>}
        <span className="text-xs" title={user.deviceType}>
          {user.deviceType === 'mobile' ? '📱' : '🖥️'}
        </span>
      </div>
    </div>
  );
}
