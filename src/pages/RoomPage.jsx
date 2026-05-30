import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import { useRoom } from '../context/RoomContext';
import { useSocket } from '../hooks/useSocket';
import { detectDeviceType, formatTime } from '../utils/helpers';
import RoomHeader from '../components/room/RoomHeader';
import UserList from '../components/room/UserList';
import VideoInput from '../components/video/VideoInput';
import ErrorBanner from '../components/ui/ErrorBanner';
import RoomCodeDisplay from '../components/room/RoomCodeDisplay';

export default function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { state, clearError } = useRoom();
  const { leaveRoom, changeVideo, playVideo, pauseVideo, seekVideo, setPlayerRef, joinRoom } = useSocket();

  const playerRef = useRef(null);
  const seekingRef = useRef(false); // prevent feedback loops
  const lastSeekRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  // Register player ref for sync
  useEffect(() => {
    setPlayerRef(playerRef);
  }, [setPlayerRef]);

  // If navigated directly to room URL without being in a room, redirect home
  useEffect(() => {
    if (!state.roomCode && !state.connectionStatus === 'connecting') {
      navigate('/');
    }
  }, [state.roomCode, navigate, state.connectionStatus]);

  // Seek to synced position when video changes or room is joined
  useEffect(() => {
    if (playerReady && playerRef.current && state.position > 1) {
      seekingRef.current = true;
      playerRef.current.seekTo(state.position, 'seconds');
      setTimeout(() => { seekingRef.current = false; }, 500);
    }
  }, [state.videoUrl, playerReady]);

  // Handle incoming seek events
  useEffect(() => {
    if (playerReady && playerRef.current && !seekingRef.current) {
      const now = Date.now();
      if (now - lastSeekRef.current > 300) { // debounce
        seekingRef.current = true;
        playerRef.current.seekTo(state.position, 'seconds');
        lastSeekRef.current = now;
        setTimeout(() => { seekingRef.current = false; }, 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.position]);

  const handleReady = () => {
    setPlayerReady(true);
    if (state.position > 1) {
      playerRef.current?.seekTo(state.position, 'seconds');
    }
  };

  const handlePlay = () => {
    if (!state.isHost) return;
    const pos = playerRef.current?.getCurrentTime() ?? 0;
    playVideo(pos);
  };

  const handlePause = () => {
    if (!state.isHost) return;
    const pos = playerRef.current?.getCurrentTime() ?? 0;
    pauseVideo(pos);
  };

  const handleSeek = (seconds) => {
    if (!state.isHost || seekingRef.current) return;
    seekingRef.current = true;
    seekVideo(seconds);
    setTimeout(() => { seekingRef.current = false; }, 500);
  };

  const handleProgress = ({ playedSeconds }) => {
    setCurrentTime(playedSeconds);
  };

  const handleDuration = (d) => setDuration(d);

  return (
    <div className="min-h-screen flex flex-col">
      <RoomHeader
        roomCode={roomCode}
        username={state.username}
        isHost={state.isHost}
        userCounts={state.userCounts}
        onLeave={leaveRoom}
      />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {state.error && (
          <div className="mb-4">
            <ErrorBanner message={state.error} onClose={clearError} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left: player + controls */}
          <div className="space-y-4">
            {/* Player */}
            <div className="relative rounded-lg overflow-hidden border border-border bg-void">
              {state.videoUrl ? (
                <div className="player-wrapper">
                  <ReactPlayer
                    ref={playerRef}
                    className="react-player"
                    url={state.videoUrl}
                    width="100%"
                    height="100%"
                    playing={state.isPlaying}
                    controls={state.isHost}
                    onReady={handleReady}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeek={handleSeek}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    progressInterval={500}
                    config={{
                      youtube: {
                        playerVars: {
                          disablekb: state.isHost ? 0 : 1,
                          modestbranding: 1,
                          rel: 0,
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <NoVideoPlaceholder isHost={state.isHost} />
              )}

              {/* Participant overlay - prevents control interaction */}
              {!state.isHost && state.videoUrl && (
                <div className="absolute inset-0 cursor-default" title="Only the host can control playback" />
              )}
            </div>

            {/* Playback info bar */}
            {state.videoUrl && (
              <div className="flex items-center gap-4 px-1">
                <span className={`w-2 h-2 rounded-full ${state.isPlaying ? 'bg-lime animate-pulse-slow' : 'bg-muted'}`} />
                <span className="text-xs font-display text-muted">
                  {state.isPlaying ? 'LIVE · ' : 'PAUSED · '}
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {!state.isHost && (
                  <span className="tag ml-auto">👀 Watching</span>
                )}
                {state.isHost && (
                  <span className="tag ml-auto bg-accent/10 border-accent/30 text-accent">👑 Host</span>
                )}
              </div>
            )}

            {/* Host: video URL input */}
            {state.isHost && (
              <VideoInput onSubmit={changeVideo} currentUrl={state.videoUrl} />
            )}

            {/* Participant: info */}
            {!state.isHost && (
              <div className="card flex items-start gap-3">
                <span className="text-lg mt-0.5">🎭</span>
                <div>
                  <p className="text-sm text-text font-body font-medium">You're a participant</p>
                  <p className="text-xs text-muted mt-0.5">
                    Playback is controlled by the host. You'll automatically sync when they play, pause, or seek.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-4">
            <RoomCodeDisplay code={roomCode} />
            <UserList
              users={state.users}
              userCounts={state.userCounts}
              hostSocketId={state.hostSocketId}
              currentUsername={state.username}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function NoVideoPlaceholder({ isHost }) {
  return (
    <div className="aspect-video flex flex-col items-center justify-center bg-surface border border-dashed border-border rounded-lg gap-3">
      <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-3xl">
        🎬
      </div>
      <p className="text-text-dim text-sm font-body text-center px-4">
        {isHost
          ? 'Paste a YouTube URL below to start watching together'
          : 'Waiting for the host to queue a video...'}
      </p>
    </div>
  );
}
