'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type PlaylistInfo = {
  playlistId: number;
  playlistName: string;
  moodTag: string | null;
  createdAt: string;
  songCount: number;
};

type PlaylistSong = {
  songId: number;
  title: string;
  artistId: number;
  artist: string;
  genreId: number;
  genre: string;
  releaseYear: number | null;
  duration: string | null;
};

type SongItem = {
  songId: number;
  title: string;
  artist: string;
};

type ArtistOption = {
  artistId: number;
  artistStageName: string;
};

type GenreOption = {
  genreId: number;
  genreName: string;
};

type PlaylistDetailsResponse = {
  playlist: PlaylistInfo;
  songs: PlaylistSong[];
  artists: ArtistOption[];
  genres: GenreOption[];
};


export default function PlaylistDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const playlistId = useMemo(() => searchParams.get('playlistId') || '', [searchParams]);

  const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SongItem[]>([]);
  const [selectedSearchSongId, setSelectedSearchSongId] = useState<number | null>(null);
  const [addingSongId, setAddingSongId] = useState<number | null>(null);
  const [addStatus, setAddStatus] = useState('');
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [genres, setGenres] = useState<GenreOption[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [deleteSongId, setDeleteSongId] = useState<number | null>(null);
  const [songTitle, setSongTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [duration, setDuration] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [updatingSong, setUpdatingSong] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [deletingSong, setDeletingSong] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadPlaylistDetails() {
      if (!playlistId) {
        setError('Missing playlist id in the URL.');
        setLoading(false);
        return;
      }

      const numericId = Number(playlistId);
      if (!Number.isInteger(numericId) || numericId < 1) {
        setError('Invalid playlist id.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/playlists/details?playlistId=' + numericId, {
          cache: 'no-store',
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load playlist details');
        }

        if (!ignore) {
          const payload = data as PlaylistDetailsResponse;
          setPlaylist(payload.playlist);
          setSongs(Array.isArray(payload.songs) ? payload.songs : []);
          setArtists(Array.isArray(payload.artists) ? payload.artists : []);
          setGenres(Array.isArray(payload.genres) ? payload.genres : []);
          setMoodTag(payload.playlist.moodTag || '');
        }
      } catch (err: any) {
        if (!ignore) {
          setPlaylist(null);
          setSongs([]);
          setError(err.message || 'Could not load playlist details.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPlaylistDetails();

    return () => {
      ignore = true;
    };
  }, [playlistId, router]);

  useEffect(() => {
    let ignore = false;

    async function searchSongs() {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const res = await fetch('/api/songs/search?q=' + encodeURIComponent(query.trim()), {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const data = await res.json();

        if (!ignore) {
          setSearchResults(Array.isArray(data.songs) ? data.songs : []);
        }
      } catch {
        if (!ignore) {
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setSearching(false);
        }
      }
    }

    const timeoutId = setTimeout(searchSongs, 250);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (!searchResults.length) {
      setSelectedSearchSongId(null);
      return;
    }

    setSelectedSearchSongId((currentSongId) => {
      if (currentSongId && searchResults.some((song) => song.songId === currentSongId)) {
        return currentSongId;
      }

      return searchResults[0].songId;
    });
  }, [searchResults]);

  useEffect(() => {
    if (!selectedSearchSongId) {
      return;
    }

    const selectedSearchSong = searchResults.find((song) => song.songId === selectedSearchSongId);
    if (selectedSearchSong) {
      setQuery(selectedSearchSong.title);
    }
  }, [searchResults, selectedSearchSongId]);

  useEffect(() => {
    if (!songs.length) {
      setSelectedSongId(null);
      setDeleteSongId(null);
      setSongTitle('');
      setArtistId('');
      setGenreId('');
      setReleaseYear('');
      setDuration('');
      return;
    }

    setSelectedSongId((currentSongId) => {
      if (currentSongId && songs.some((song) => song.songId === currentSongId)) {
        return currentSongId;
      }

      return songs[0].songId;
    });

    setDeleteSongId((currentSongId) => {
      if (currentSongId && songs.some((song) => song.songId === currentSongId)) {
        return currentSongId;
      }

      return songs[0].songId;
    });
  }, [songs]);

  const selectedSong = useMemo(
    () => songs.find((song) => song.songId === selectedSongId) || null,
    [songs, selectedSongId]
  );

  useEffect(() => {
    if (!selectedSong) {
      return;
    }

    setSongTitle(selectedSong.title);
    setArtistId(String(selectedSong.artistId));
    setGenreId(String(selectedSong.genreId));
    setReleaseYear(selectedSong.releaseYear ? String(selectedSong.releaseYear) : '');
    setDuration(selectedSong.duration || '');
  }, [selectedSong]);

  async function handleAddSong(songId: number) {
    if (!playlist) {
      setAddStatus('Playlist not loaded yet.');
      return;
    }

    try {
      setAddStatus('');
      setAddingSongId(songId);

      const res = await fetch('/api/playlists/add-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId: playlist.playlistId, songId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not add song');
      }

      setAddStatus(data.message || 'Song added.');
      setQuery('');
      setSearchResults([]);

      const refreshRes = await fetch('/api/playlists/details?playlistId=' + playlist.playlistId, {
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setPlaylist(refreshed.playlist);
        setSongs(Array.isArray(refreshed.songs) ? refreshed.songs : []);
        setArtists(Array.isArray(refreshed.artists) ? refreshed.artists : []);
        setGenres(Array.isArray(refreshed.genres) ? refreshed.genres : []);
        setMoodTag(refreshed.playlist.moodTag || '');
      }
    } catch (err: any) {
      setAddStatus(err.message || 'Could not add song.');
    } finally {
      setAddingSongId(null);
    }
  }

  function selectSongForEdit(songId: number) {
    setSelectedSongId(songId);
    setUpdateStatus('');
  }

  function selectSongForDelete(songId: number) {
    setDeleteSongId(songId);
    setDeleteStatus('');
  }

  async function handleUpdateSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!playlist) {
      setUpdateStatus('Playlist not loaded yet.');
      return;
    }

    if (!selectedSongId) {
      setUpdateStatus('Select a song to edit first.');
      return;
    }

    const numericArtistId = Number(artistId);
    const numericGenreId = Number(genreId);

    if (!songTitle.trim()) {
      setUpdateStatus('Song name is required.');
      return;
    }

    if (!Number.isInteger(numericArtistId) || numericArtistId < 1) {
      setUpdateStatus('Select an artist.');
      return;
    }

    if (!Number.isInteger(numericGenreId) || numericGenreId < 1) {
      setUpdateStatus('Select a genre.');
      return;
    }

    const numericReleaseYear = releaseYear.trim() ? Number(releaseYear) : null;

    if (releaseYear.trim() && (numericReleaseYear === null || !Number.isInteger(numericReleaseYear) || numericReleaseYear < 1000 || numericReleaseYear > 9999)) {
      setUpdateStatus('Enter a valid 4-digit year.');
      return;
    }

    const normalizedDuration = duration.trim();

    if (normalizedDuration && !/^\d{2}:\d{2}$/.test(normalizedDuration)) {
      setUpdateStatus('Enter duration as MM:SS.');
      return;
    }

    try {
      setUpdatingSong(true);
      setUpdateStatus('');

      const res = await fetch('/api/playlists/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: playlist.playlistId,
          songId: selectedSongId,
          songTitle: songTitle.trim(),
          artistId: numericArtistId,
          genreId: numericGenreId,
          releaseYear: numericReleaseYear,
          duration: normalizedDuration,
          moodTag,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not update song details');
      }

      setUpdateStatus(data.message || 'Song details updated.');

      const refreshRes = await fetch('/api/playlists/details?playlistId=' + playlist.playlistId, {
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setPlaylist(refreshed.playlist);
        setSongs(Array.isArray(refreshed.songs) ? refreshed.songs : []);
        setArtists(Array.isArray(refreshed.artists) ? refreshed.artists : []);
        setGenres(Array.isArray(refreshed.genres) ? refreshed.genres : []);
        setMoodTag(refreshed.playlist.moodTag || '');
      }
    } catch (err: any) {
      setUpdateStatus(err.message || 'Could not update song details.');
    } finally {
      setUpdatingSong(false);
    }
  }

  async function handleDeleteSong() {
    if (!playlist) {
      setDeleteStatus('Playlist not loaded yet.');
      return;
    }

    if (!deleteSongId) {
      setDeleteStatus('Select a song to delete first.');
      return;
    }

    try {
      setDeletingSong(true);
      setDeleteStatus('');

      const res = await fetch('/api/playlists/remove-song', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId: playlist.playlistId, songId: deleteSongId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not delete song from playlist');
      }

      setDeleteStatus(data.message || 'Song removed from playlist.');

      const refreshRes = await fetch('/api/playlists/details?playlistId=' + playlist.playlistId, {
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setPlaylist(refreshed.playlist);
        setSongs(Array.isArray(refreshed.songs) ? refreshed.songs : []);
        setArtists(Array.isArray(refreshed.artists) ? refreshed.artists : []);
        setGenres(Array.isArray(refreshed.genres) ? refreshed.genres : []);
        setMoodTag(refreshed.playlist.moodTag || '');
      }
    } catch (err: any) {
      setDeleteStatus(err.message || 'Could not delete song.');
    } finally {
      setDeletingSong(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading playlist details...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <button
            type="button"
            className="rounded-full border border-border bg-background/80 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
            onClick={() => router.push('/playlistDashboard')}>
            Back to Playlists
          </button>

          <div className="card p-6 text-error">{error}</div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <button
            type="button"
            className="rounded-full border border-border bg-background/80 px-6 py-3 text-md font-semibold text-primary transition-colors hover:border-primary/40"
            onClick={() => router.push('/playlistDashboard')}>
            Back to Playlists
          </button>

          <div className="card p-6">Playlist unavailable.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black">{playlist.playlistName}</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Demostrating CRUD operations for song_playlists table</p>
            <h4 className="text-md text-muted bold mt-1">
              Mood: {playlist.moodTag || 'none'} · Songs: {songs.length}
            </h4>
          </div>

          <button
            type="button"
            className="rounded-full border border-border bg-background/80 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
            onClick={() => router.push('/playlistDashboard')}
          >
            Back to Playlists
          </button>
        </div>

        {/* Reading Songs Section */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Songs in this Playlist</h2>

          {songs.length === 0 ? (
            <p className="text-sm text-muted">This playlist has no songs yet.</p>
          ) : (
            <div className="space-y-3">
              {songs.map((song, index) => (
                <div key={song.songId} className="rounded-xl border border-light p-4">
                  <div>
                    <p className="font-bold text-lg">
                      {index + 1}. {song.title}
                    </p>
                    <p className="text-sm text-muted">
                      Artist: {song.artist} · Genre: {song.genre}
                      {song.releaseYear ? ` · Year: ${song.releaseYear}` : ''}
                      {song.duration ? ` · Duration: ${song.duration}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Adding Songs Section - Create operation */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Add Songs To A Playlist</h2>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Search songs by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            />

            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => selectedSearchSongId && handleAddSong(selectedSearchSongId)}
              disabled={selectedSearchSongId === null || addingSongId !== null}
            >
              {addingSongId !== null ? 'Adding...' : 'Add Song'}
            </button>
          </div>

          <p className="text-sm text-muted mb-3">Adding to: {playlist.playlistName}</p>

          {addStatus && <p className="text-sm mb-3">{addStatus}</p>}

          <div className="space-y-2">
            {searching && <p className="text-muted">Searching...</p>}
            {!searching && query.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-muted">No matching songs found.</p>
            )}

            {!searching && searchResults.length > 0 && (
              <label className="space-y-2 block">
                <span className="text-sm font-semibold">Matching Songs</span>
                <select
                  className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                  value={selectedSearchSongId ?? ''}
                  onChange={(e) => {
                    const songId = Number(e.target.value);
                    setSelectedSearchSongId(songId);

                    const selectedSearchSong = searchResults.find((song) => song.songId === songId);
                    if (selectedSearchSong) {
                      setQuery(selectedSearchSong.title);
                    }
                  }}
                >
                  {searchResults.map((song) => (
                    <option key={song.songId} value={song.songId}>
                      {song.title} - {song.artist}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </section>

        {/* Update Song Details Section */}
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Update Song Details</h2>

          {songs.length === 0 ? (
            <p className="text-sm text-muted">Add a song first, then select it here to edit its details.</p>
          ) : (
            <form className="space-y-4" onSubmit={handleUpdateSong}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Select Song</span>
                  <select
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                    value={selectedSongId ?? ''}
                    onChange={(e) => selectSongForEdit(Number(e.target.value))}
                  >
                    {songs.map((song) => (
                      <option key={song.songId} value={song.songId}>
                        {song.title} - {song.artist}
                      </option>
                    ))}
                  </select>
                </label>

                
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Song Name</span>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Artist</span>
                  <select
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                  >
                    <option value="">Select an artist</option>
                    {artists.map((artist) => (
                      <option key={artist.artistId} value={artist.artistId}>
                        {artist.artistStageName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Genre</span>
                  <select
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                    value={genreId}
                    onChange={(e) => setGenreId(e.target.value)}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre.genreId} value={genre.genreId}>
                        {genre.genreName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Release Year</span>
                  <input
                    type="number"
                    min="1000"
                    max="9999"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    placeholder="2024"
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Duration</span>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
                  />
                </label>
              </div>

              {selectedSong && (
                <p className="text-sm text-muted">
                  Editing {selectedSong.title} by {selectedSong.artist}.
                </p>
              )}

              {updateStatus && <p className="text-sm text-muted">{updateStatus}</p>}

              <button
                type="submit"
                className="btn bg-primary px-6 py-3 text-md font-semibold text-white transition-colors hover:opacity-90 "
                disabled={updatingSong}
              >
                {updatingSong ? 'Saving...' : 'Save Song Details'}
              </button>
            </form>
          )}
        </section>

        {/* Remove Songs from Playlist Section */}
        <section className="card p-6">
            <h2 className="text-2xl font-black mb-4">Delete Songs from Playlist</h2>
            {songs.length === 0 ? (
              <p className="text-sm text-muted">This playlist has no songs to delete.</p>
            ) : (
              <div className="space-y-4">
                <form
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleDeleteSong();
                  }}
                >
                  <label className="space-y-2">
                    <select
                      className="h-12 w-full rounded-xl border border-light bg-background/70 px-3 text-foreground"
                      value={deleteSongId ?? ''}
                      onChange={(e) => selectSongForDelete(Number(e.target.value))}
                      required
                    >
                      <option value="">Select song to delete</option>
                      {songs.map((song) => (
                        <option key={song.songId} value={song.songId}>
                          {song.title} - {song.artist}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="submit"
                    className="h-12 rounded-xl bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary/90"
                    disabled={deletingSong}
                  >
                    {deletingSong ? 'Deleting...' : 'Delete Song'}
                  </button>
                </form>

                {deleteStatus && <p className="text-sm text-muted">{deleteStatus}</p>}
              </div>
            )}
        </section>
      </div>
    </div>
  );
}