import React, { createContext, useContext, useReducer, useCallback } from 'react';

const RoomContext = createContext(null);

const initialState = {
  // Room info
  roomCode: null,
  isHost: false,
  hostSocketId: null,
  username: null,
  deviceType: null,

  // Users
  users: [],
  userCounts: null,

  // Playback
  videoUrl: null,
  videoId: null,
  position: 0,
  isPlaying: false,

  // UI state
  connectionStatus: 'disconnected', // 'disconnected' | 'connecting' | 'connected' | 'error'
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'ROOM_CREATED':
    case 'ROOM_JOINED': {
      const { roomCode, isHost, hostSocketId, username, users, userCounts, playbackState } = action.payload;
      return {
        ...state,
        roomCode,
        isHost,
        hostSocketId,
        username: username || state.username,
        users: users || [],
        userCounts,
        videoUrl: playbackState?.videoUrl || null,
        videoId: playbackState?.videoId || null,
        position: playbackState?.position || 0,
        isPlaying: playbackState?.isPlaying || false,
        error: null,
      };
    }

    case 'USER_COUNT':
      return {
        ...state,
        users: action.payload.users || state.users,
        userCounts: action.payload.userCounts || state.userCounts,
      };

    case 'VIDEO_CHANGED':
      return {
        ...state,
        videoUrl: action.payload.videoUrl,
        videoId: action.payload.videoId,
        position: action.payload.position ?? 0,
        isPlaying: action.payload.isPlaying ?? false,
      };

    case 'VIDEO_PLAY':
      return { ...state, isPlaying: true, position: action.payload.position ?? state.position };

    case 'VIDEO_PAUSE':
      return { ...state, isPlaying: false, position: action.payload.position ?? state.position };

    case 'VIDEO_SEEK':
      return { ...state, position: action.payload.position };

    case 'SYNC_STATE':
      return {
        ...state,
        position: action.payload.position,
        isPlaying: action.payload.isPlaying,
        videoUrl: action.payload.videoUrl || state.videoUrl,
        videoId: action.payload.videoId || state.videoId,
      };

    case 'BECAME_HOST':
      return { ...state, isHost: true };

    case 'LEAVE_ROOM':
      return { ...initialState };

    case 'SET_USERNAME':
      return { ...state, username: action.payload.username, deviceType: action.payload.deviceType };

    default:
      return state;
  }
}

export function RoomProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = useCallback((msg) => dispatch({ type: 'SET_ERROR', payload: msg }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  return (
    <RoomContext.Provider value={{ state, dispatch, setError, clearError }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used within RoomProvider');
  return ctx;
}
