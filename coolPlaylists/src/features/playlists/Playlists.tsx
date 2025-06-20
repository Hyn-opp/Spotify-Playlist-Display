import React, { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow } from '../../API/authCodeWithPkce';
import './playlists.css';
import like from '../../assets/like-button.png';
import comment from '../../assets/comment.png';
import { Link } from 'react-router-dom';

type Playlist = {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  external_urls: { spotify: string };
};

//React component that displays the Spotify playlists of the user after authentication using OAuth 2.0 Authorization Code Flow with PKCE.


const SpotifyPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const controller = new AbortController();
    const fetchPlaylists = async () => {
   

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            redirectToAuthCodeFlow(clientId);
          }
          redirectToAuthCodeFlow(clientId);

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
    <div className="playlist-list">
      {playlists.map((playlist) => (
       <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="playlist-item">
          <img
            src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
            alt={playlist.name}
            className="playlist-thumb"
          />
          <div className="playlist-info">
            <h3 className="playlist-name">{playlist.name}</h3>
              <a
                key={playlist.id}
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="playlist-description">
                  {playlist.description || 'No description provided.'}
                </p>
              </a>
            <div className='playlist-interaction'>
              <button className="like-button" >
                <img src={like} alt="Like" id="like-icon" />
              </button>
              <button className="comment-button" >
                <img src={comment} alt="Comment" id="like-icon" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SpotifyPlaylists;
