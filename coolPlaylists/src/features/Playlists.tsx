import React, { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from '../API/authCodeWithPkce';
type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
};

//React component that displays the Spotify playlists of the user after authentication using OAuth 2.0 Authorization Code Flow with PKCE.


const SpotifyPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id

  useEffect(() => {
    const controller = new AbortController();
    const fetchPlaylists = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        redirectToAuthCodeFlow(clientId);
        return;
      }

      try {
        const accessToken = await getAccessToken(clientId, code);

        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Spotify token expired. Please log in again.');
          }
          throw new Error('Failed to fetch playlists');
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      }
    };

    fetchPlaylists();

    return () => controller.abort();
  }, [clientId]);

  if (error) return <p>Error: {error}</p>;
  if (!playlists.length) return <p>Loading playlists...</p>;

  return (
    <div>
      <h1>Spotify Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyPlaylists;