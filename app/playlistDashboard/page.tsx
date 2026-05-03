'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Playlist = {
  playlistId: number;
  playlistName: string;
  moodTag: string | null;
  createdAt: string;
  songCount: number;
};

type DashboardData = {
  playlists: Playlist[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newMoodTag, setNewMoodTag] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [createStatus, setCreateStatus] = useState('');
  const [updateSelectedPlaylistId, setUpdateSelectedPlaylistId] = useState('');
  const [updatePlaylistName, setUpdatePlaylistName] = useState('');
  const [updateMoodTag, setUpdateMoodTag] = useState('');
  const [updatingPlaylist, setUpdatingPlaylist] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');

  async function fetchDashboard(showLoading = false) {
    if (showLoading) {
      setLoading(true);
    }

    setError('');

    const res = await fetch('/api/dashboard', { cache: 'no-store' });

    if (res.status === 401) {
      router.push('/login');
      return false;
    }

    if (!res.ok) {
      throw new Error('Failed to load dashboard');
    }

    const data = await res.json();
    setDashboard(data);

    return true;
  }

  useEffect(() => {
    let ignore = false;

    async function initializeDashboard() {
      try {
        if (!ignore) {
          await fetchDashboard(true);
        }
      } catch (err) {
        if (!ignore) {
          setError('Could not load your dashboard.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initializeDashboard();

    return () => {
      ignore = true;
    };
  }, [router]);

  useEffect(() => {
    let ignore = false;

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!dashboard?.playlists.length) {
      setSelectedPlaylistId('');
      return;
    }

    setSelectedPlaylistId((currentValue) => {
      const stillExists = dashboard.playlists.some(
        (playlist) => playlist.playlistId.toString() === currentValue
      );

      return stillExists ? currentValue : dashboard.playlists[0].playlistId.toString();
    });
  }, [dashboard]);

  useEffect(() => {
    if (!dashboard?.playlists.length) {
      setUpdateSelectedPlaylistId('');
      setUpdatePlaylistName('');
      setUpdateMoodTag('');
      return;
    }

    setUpdateSelectedPlaylistId((currentValue) => {
      const stillExists = dashboard.playlists.some(
        (playlist) => playlist.playlistId.toString() === currentValue
      );

      return stillExists ? currentValue : dashboard.playlists[0].playlistId.toString();
    });
  }, [dashboard]);

  useEffect(() => {
    if (!dashboard?.playlists.length || !updateSelectedPlaylistId) {
      setUpdatePlaylistName('');
      setUpdateMoodTag('');
      return;
    }

    const selectedPlaylist = dashboard.playlists.find(
      (playlist) => playlist.playlistId.toString() === updateSelectedPlaylistId
    );

    setUpdatePlaylistName(selectedPlaylist?.playlistName || '');
    setUpdateMoodTag(selectedPlaylist?.moodTag || '');
  }, [dashboard, updateSelectedPlaylistId]);

  async function handleCreatePlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCreateStatus('');
      setCreatingPlaylist(true);

      const res = await fetch('/api/playlists/playlist-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistName: newPlaylistName,
          moodTag: newMoodTag,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not create playlist');
      }

      setCreateStatus(data.message || 'Playlist created.');
      setNewPlaylistName('');
      setNewMoodTag('');

      await fetchDashboard(false);
    } catch (err: any) {
      setCreateStatus(err.message || 'Could not create playlist.');
    } finally {
      setCreatingPlaylist(false);
    }
  }

  async function handleUpdatePlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!updateSelectedPlaylistId) {
      setUpdateStatus('Please choose a playlist to update.');
      return;
    }

    try {
      setUpdateStatus('');
      setUpdatingPlaylist(true);

      const res = await fetch('/api/playlists/playlist-actions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: Number(updateSelectedPlaylistId),
          playlistName: updatePlaylistName,
          moodTag: updateMoodTag,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not update playlist');
      }

      setUpdateStatus(data.message || 'Playlist updated successfully.');

      await fetchDashboard(false);
    } catch (err: any) {
      setUpdateStatus(err.message || 'Could not update playlist.');
    } finally {
      setUpdatingPlaylist(false);
    }
  }

  async function handleDeletePlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPlaylistId) {
      setDeleteStatus('Please choose a playlist to delete.');
      return;
    }

    try {
      setDeleteStatus('');
      setDeletingPlaylist(true);

      const res = await fetch('/api/playlists/playlist-actions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: Number(selectedPlaylistId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not delete playlist');
      }

      setDeleteStatus(data.message || 'Playlist deleted.');
      setSelectedPlaylistId('');

      await fetchDashboard(false);
    } catch (err: any) {
      setDeleteStatus(err.message || 'Could not delete playlist.');
    } finally {
      setDeletingPlaylist(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading dashboard...</div>;
  }

  if (error || !dashboard) {
    return <div className="min-h-screen grid place-items-center">{error || 'Dashboard unavailable.'}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black">Manage Playlists</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Demostrating CRUD operations for playlists table</p>
          </div>
          <button type="button" className="rounded-full border border-border bg-background/80 px-6 py-3 text-md font-semibold text-primary transition-colors hover:border-primary/40" 
            onClick={() => router.push('/menu')}>
            Back to Menu
          </button>
        </div>

        {/* Read Operation - Playlists section */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Your Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboard.playlists.length ? (
              dashboard.playlists.map((playlist) => (
                <button key={playlist.playlistId} type= "button" 
                onClick={() => router.push('/playlistDetails?playlistId=' + playlist.playlistId)}
                className="w-full text-left p-4 border border-border rounded transition-all cursor-pointer hover:bg-blue-200  hover:shadow-sm focus-visible:ring-2">
                  <p className="font-bold text-lg">{playlist.playlistName}</p>
                  <p className ="text-sm text-muted"> Mood: {playlist.moodTag || 'No mood tag'}</p>
                  <p className="text-sm text-muted"> Songs: {playlist.songCount}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">You do not have any playlists yet.</p>
            )}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Add New Playlist</h2>

          <form
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 mb-4"
            onSubmit={handleCreatePlaylist}
          >
            <input
              type="text"
              placeholder="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            />

            <input
              type="text"
              placeholder="Mood Tag"
              value={newMoodTag}
              onChange={(e) => setNewMoodTag(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            />

            <button
              type="submit"
              className="btn btn-primary md:px-8"
              disabled={creatingPlaylist}
            >
              {creatingPlaylist ? 'Creating...' : 'Create Playlist'}
            </button>
          </form>

          {createStatus && <p className="text-sm mb-3">{createStatus}</p>}
        </section>

        {/* Update section */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Update Current Playlist Information</h2>

          <form
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 mb-4"
            onSubmit={handleUpdatePlaylist}
          >
            <label className="flex flex-col gap-2 md:col-span-4">
              <p className="text-md text-muted mb-4">What playlist do you want to update?</p>
              <select
                value={updateSelectedPlaylistId}
                onChange={(e) => setUpdateSelectedPlaylistId(e.target.value)}
                className="w-full px-10 py-15 pr-24 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
                disabled={!dashboard.playlists.length || updatingPlaylist}
              >
                <option value="">Choose a playlist</option>
                {dashboard.playlists.map((playlist) => (
                  <option key={playlist.playlistId} value={playlist.playlistId}>
                    {playlist.playlistName}
                  </option>
                ))}
              </select>
            </label>

            <input
              type="text"
              placeholder="Playlist name"
              value={updatePlaylistName}
              onChange={(e) => setUpdatePlaylistName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
              disabled={!updateSelectedPlaylistId || updatingPlaylist}
            />

            <input
              type="text"
              placeholder="Mood tag"
              value={updateMoodTag}
              onChange={(e) => setUpdateMoodTag(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
              disabled={!updateSelectedPlaylistId || updatingPlaylist}
            />

            <button
              type="submit"
              className="btn btn-primary md:px-8"
              disabled={!updateSelectedPlaylistId || updatingPlaylist}
            >
              {updatingPlaylist ? 'Updating...' : 'Update Playlist'}
            </button>
          </form>

          {updateStatus && <p className="text-sm mb-3">{updateStatus}</p>}
        </section>

        {/* Delete section */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-2">Delete Playlist</h2>
          <p className="text-md text-muted mb-4">What playlist do you want to delete?</p>

          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleDeletePlaylist}>
            <label className="space-y-2">
              <select
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="h-12 w-full rounded-xl border border-light bg-background/70 px-3 text-foreground"
                disabled={!dashboard.playlists.length || deletingPlaylist}
                required
              >
                <option value="">Choose a playlist</option>
                {dashboard.playlists.map((playlist) => (
                  <option key={playlist.playlistId} value={playlist.playlistId}>
                    {playlist.playlistName}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="h-12 rounded-xl bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary/90"
              disabled={!dashboard.playlists.length || deletingPlaylist}
            >
              {deletingPlaylist ? 'Deleting...' : 'Delete Playlist'}
            </button>
          </form>

          {deleteStatus && <p className="text-sm mt-3">{deleteStatus}</p>}
        </section>

        
      </div>
    </div>
  );
}
