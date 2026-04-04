'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
  });

  function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Sign up failed';
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      router.push('/login?created=1');
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl bg-surface p-10 shadow-lg">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-center text-primary">Create your account</h2>
          <p className="text-sm text-muted">
            Fill in every required field for the `users` table to get started.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {formError && <p className="text-center text-sm text-red-500">{formError}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-primary">First name</label>
              <input
                type="text"
                className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring"
                value={form.first_name}
                onChange={(e) => updateField('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary">Last name</label>
              <input
                type="text"
                className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring"
                value={form.last_name}
                onChange={(e) => updateField('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary">Email address</label>
            <input
              type="email"
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary">Username</label>
            <input
              type="text"
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary">Password</label>
            <input
              type="password"
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-primary rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <button
            type="button"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
            onClick={() => router.push('/login')}
          >
            Log back in
          </button>
        </p>
      </div>
    </div>
  );
}
