'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
};

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [draftUsername, setDraftUsername] = useState('');
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  function handleBackToLogin() {
    router.push('/login');
  }

  function handleBackToMenu() {
    router.push('/menu');
  }

  function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Something went wrong';
  }

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        setLoading(true);
        setStatus('');

        const res = await fetch('/api/users/me', { cache: 'no-store' });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Could not load your profile');
        }

        if (ignore) {
          return;
        }

        const nextUser = {
          id: Number(data.user.id),
          username: data.user.username,
          name: `${data.user.first_name} ${data.user.last_name}`.trim(),
          email: data.user.email ?? '',
        };

        setUser(nextUser);
        setDraftUsername(nextUser.username);
        setDraftName(nextUser.name);
        setDraftEmail(nextUser.email);
      } catch (error: unknown) {
        if (!ignore) {
          setStatus(getErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleProfileUpdate() {
    if (!user) {
      return;
    }

    const trimmedUsername = draftUsername.trim();
    const trimmedName = draftName.trim();
    const trimmedEmail = draftEmail.trim().toLowerCase();

    if (!trimmedUsername) {
      setStatus('Username cannot be empty.');
      return;
    }

    if (!trimmedName) {
      setStatus('Name cannot be empty.');
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!isValidEmail) {
      setStatus('Please enter a valid email address.');
      return;
    }

    const [first_name, ...lastParts] = trimmedName.split(/\s+/);
    const last_name = lastParts.join(' ');

    try {
      setSaving(true);
      setStatus('');

      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          first_name,
          last_name,
          email: trimmedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not update profile');
      }

      const updatedName = `${data.user?.first_name ?? first_name} ${data.user?.last_name ?? last_name}`.trim();

      setUser({
        ...user,
        username: data.user?.username ?? trimmedUsername,
        name: updatedName,
        email: data.user?.email ?? trimmedEmail,
      });
      setDraftUsername(data.user?.username ?? trimmedUsername);
      setDraftName(updatedName);
      setDraftEmail(data.user?.email ?? trimmedEmail);
      setStatus(data.message || 'Profile updated.');
    } catch (error: unknown) {
      setStatus(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) {
      return;
    }

    try {
      setDeleting(true);
      setStatus('');

      const res = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not delete account');
      }

      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setDraftUsername('');
      setDraftName('');
      setDraftEmail('');
      setStatus(data.message || 'Account deleted.');
      setAccountDeleted(true);
    } catch (error: unknown) {
      setStatus(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-background text-foreground">Loading profile...</div>;
  }

  if (!user && !accountDeleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-lg rounded-3xl bg-surface p-8 text-center shadow-lg">
          <h1 className="text-3xl font-black">Account Center</h1>
          <p className="mt-3 text-muted">{status || 'Sign in first so we can load your profile.'}</p>
          <button className="mt-6 btn btn-primary px-8 py-3" onClick={handleBackToLogin}>
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70"
        style={{
          background:
            'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 45%), linear-gradient(180deg, rgba(99,102,241,0.08), transparent)'}}/>
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="rounded-[2rem] border border-border/70 bg-surface p-8 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-subtle">Profile</p>
              <h1 className="mt-3 text-4xl font-black">Account Center</h1>
            </div>
            <button
              className="rounded-full border border-border bg-background/80 px-4 py-2 text-md font-semibold text-primary transition-colors hover:border-primary/40"
              onClick={handleBackToMenu}>
              Back to menu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Manage your details</h2>
          </div>
        </div>

        {!accountDeleted && user && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
            <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-xl">
              <div className="border-b border-border/70 px-8 py-6">
                <h2 className="text-2xl font-bold text-primary">User information</h2>
              </div>
              <div className="grid gap-4 p-8 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-subtle">Name</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{user.name}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-subtle">Username</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{user.username}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-subtle">Email</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-xl">
              <div className="border-b border-border/70 px-8 py-6">
                <h2 className="text-2xl font-bold text-primary">Edit profile</h2>
              </div>
              <div className="space-y-5 p-8">
                <div className="rounded-2xl border border-border bg-background/60 p-5">
                  <label className="block text-sm font-medium text-primary">Name</label>
                  <input
                    type="text"
                    className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-3 text-foreground focus:border-primary focus:outline-none focus:ring"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}/>

                  <label className="mt-4 block text-sm font-medium text-primary">Email</label>
                  <input
                    type="email"
                    className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-3 text-foreground focus:border-primary focus:outline-none focus:ring"
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}/>

                  <label className="mt-4 block text-sm font-medium text-primary">Username</label>
                  <input
                    type="text"
                    className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-3 text-foreground focus:border-primary focus:outline-none focus:ring"
                    value={draftUsername}
                    onChange={(e) => setDraftUsername(e.target.value)}/>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleProfileUpdate}
                    disabled={saving || deleting}>
                    {saving ? 'Saving changes...' : 'Save profile changes'}
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl border border-red-400/60 bg-red-100 py-3 font-semibold text-red-700 transition-colors hover:border-red-500 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleDeleteAccount}
                  disabled={saving || deleting}>
                  {deleting ? 'Deleting account...' : 'Delete account'}
                </button>

                {status && (
                  <p className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-muted">
                    {status}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {accountDeleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-xl">
              <h2 className="text-xl font-bold text-foreground">Your account has been deleted</h2>
              <button
                className="mt-5 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
                onClick={handleBackToLogin}>
                Back to login
              </button>
              {status && <p className="mt-3 text-sm text-muted">{status}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

