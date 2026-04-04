'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const accountCreated = searchParams.get('created') === '1';

  function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Login failed';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          'karaoke-demo-user',
          JSON.stringify({
            id: data.user?.id ?? null,
            username: data.user?.username ?? username,
            name: data.user?.name ?? username,
          })
        );
      }

      router.push('/user');
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-xl p-10 space-y-6 bg-surface rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary">Sign In</h2>
        {accountCreated && (
          <p className="text-center text-sm text-green-600">
            Account created. Sign in with your new username and password.
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError && <p className="text-center text-sm text-red-500">{formError}</p>}

          <div>
            <label className="block text-sm font-medium text-primary">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-primary rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Need an account?{' '}
          <button
            type="button"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
            onClick={() => router.push('/signup')}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
