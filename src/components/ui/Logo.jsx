import React from 'react';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { text: 'text-2xl', dot: 'w-2 h-2' },
    lg: { text: 'text-3xl', dot: 'w-2.5 h-2.5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className={`font-display font-bold ${s.text} text-text tracking-tight`}>
          Sync<span className="text-accent">Music</span>
        </span>
        <span
          className={`absolute -top-0.5 -right-3 ${s.dot} rounded-full bg-lime animate-pulse-slow`}
          title="Live"
        />
      </div>
    </div>
  );
}
