import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { redirectToAuthCodeFlow } from '../../API/authCodeWithPkce.ts'; // Import your auth function

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id

  useEffect(() => {
    const controller = new AbortController();
  
    if (!accessToken) {
      console.error("Missing token, redirecting...");
      redirectToAuthCodeFlow(clientId);
      return;
    }
  
    if (!id) {
      console.error("Missing playlist ID from route params.");
      setError("Invalid playlist ID.");
      return;
    }
  
    const fetchSongs = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            redirectToAuthCodeFlow(clientId);
          }
          throw new Error(`Failed to fetch songs: ${response.status}`);
        }
  
        const data = await response.json();
        setSongs(data.items);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      }
    };
  
    fetchSongs();
    return () => controller.abort();
  }, [id, accessToken]);
  

  return (
    <div>
      <h1>Playlist Songs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {songs.map((song: any, index: number) => (
          <li key={index}>{song.track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;