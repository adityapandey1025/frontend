/**
 * Detect whether the current device is mobile or desktop.
 * Returns 'mobile' or 'desktop'.
 */
export function detectDeviceType() {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  // Also check screen width as fallback
  const isNarrow = window.innerWidth < 768;
  return isMobile || isNarrow ? 'mobile' : 'desktop';
}

/**
 * Extract YouTube video ID from a URL string.
 */
export function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * Format seconds into mm:ss or h:mm:ss.
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Merge Tailwind class names, deduplicating conflicts.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
