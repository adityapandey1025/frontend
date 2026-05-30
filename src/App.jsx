import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoomProvider } from './context/RoomContext';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <RoomProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomCode" element={<RoomPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </RoomProvider>
  );
}
