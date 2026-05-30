import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Logo />
      <h1 className="font-display text-6xl text-accent mt-8 mb-2">404</h1>
      <p className="text-text-dim font-body text-center mb-8">
        This page doesn't exist. Maybe the room expired?
      </p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  );
}
