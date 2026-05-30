import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket';
import { useRoom } from '../context/RoomContext';

export function useSocket() {
  const { dispatch, setError } = useRoom();
  const navigate = useNavigate();
  const syncIntervalRef = useRef(null);
  const playerRef = useRef(null); // set by player component

  // Register the player reference so sync can read position
  const setPlayerRef = useCallback((ref) => {
    playerRef.current = ref;
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });

    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
    });

    socket.on('disconnect', (reason) => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: reason === 'io client disconnect' ? 'disconnected' : 'error' });
      clearSyncInterval();
    });

    socket.on('connect_error', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
      setError('Cannot connect to server. Please try again.');
    });

    // ── Room Events ────────────────────────────────────────────────────────
    socket.on('room-created', (payload) => {
      dispatch({ type: 'ROOM_CREATED', payload });
      navigate(`/room/${payload.roomCode}`);
    });

    socket.on('room-joined', (payload) => {
      dispatch({ type: 'ROOM_JOINED', payload });
      if (!window.location.pathname.startsWith('/room/')) {
        navigate(`/room/${payload.roomCode}`);
      }
      // If joined as new host (promotion), mark it
      if (payload.isHost) dispatch({ type: 'BECAME_HOST' });
      startSyncInterval(socket);
    });

    socket.on('user-count', (payload) => {
      dispatch({ type: 'USER_COUNT', payload });
    });

    // ── Video Events ────────────────────────────────────────────────────────
    socket.on('video-changed', (payload) => {
      dispatch({ type: 'VIDEO_CHANGED', payload });
    });

    socket.on('video-play', (payload) => {
      dispatch({ type: 'VIDEO_PLAY', payload });
    });

    socket.on('video-pause', (payload) => {
      dispatch({ type: 'VIDEO_PAUSE', payload });
    });

    socket.on('video-seek', (payload) => {
      dispatch({ type: 'VIDEO_SEEK', payload });
    });

    // ── Drift Correction ────────────────────────────────────────────────────
    socket.on('sync-state', (payload) => {
      dispatch({ type: 'SYNC_STATE', payload });
    });

    // ── Errors ──────────────────────────────────────────────────────────────
    socket.on('error-message', ({ message, event }) => {
      if (event === 'room-closed') {
        setError('The room has been closed.');
        dispatch({ type: 'LEAVE_ROOM' });
        navigate('/');
        return;
      }
      setError(message || 'An error occurred.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('user-count');
      socket.off('video-changed');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-seek');
      socket.off('sync-state');
      socket.off('error-message');
      clearSyncInterval();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync interval: send client position every 5s ───────────────────────────
  function startSyncInterval(socket) {
    clearSyncInterval();
    syncIntervalRef.current = setInterval(() => {
      if (playerRef.current && socket.connected) {
        const pos = playerRef.current.getCurrentTime?.() ?? 0;
        socket.emit('sync-request', { clientPosition: pos });
      }
    }, 5000);
  }

  function clearSyncInterval() {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }

  // ── Emit helpers ───────────────────────────────────────────────────────────
  const createRoom = useCallback(({ username, deviceType }) => {
    getSocket().emit('create-room', { username, deviceType });
  }, []);

  const joinRoom = useCallback(({ username, deviceType, roomCode }) => {
    getSocket().emit('join-room', { username, deviceType, roomCode });
    startSyncInterval(getSocket());
  }, []);

  const leaveRoom = useCallback(() => {
    getSocket().emit('leave-room');
    dispatch({ type: 'LEAVE_ROOM' });
    clearSyncInterval();
    navigate('/');
  }, [dispatch, navigate]);

  const changeVideo = useCallback((videoUrl) => {
    getSocket().emit('video-change', { videoUrl });
  }, []);

  const playVideo = useCallback((position) => {
    getSocket().emit('play-video', { position });
  }, []);

  const pauseVideo = useCallback((position) => {
    getSocket().emit('pause-video', { position });
  }, []);

  const seekVideo = useCallback((position) => {
    getSocket().emit('seek-video', { position });
  }, []);

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    changeVideo,
    playVideo,
    pauseVideo,
    seekVideo,
    setPlayerRef,
  };
}
