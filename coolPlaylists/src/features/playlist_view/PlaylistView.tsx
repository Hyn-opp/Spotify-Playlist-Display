import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { redirectToAuthCodeFlow } from '../../API/authCodeWithPkce.ts'; // Import your auth function
import './playlistView.css'; // Import your CSS styles

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const [songs, setSongs] = useState<any[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id


  /* Need to get the accessToken from localStorage to make API calls but can only do that in the useEffect */
  useEffect(() => {
    
    const accessToken = localStorage.getItem('access_token');
    console.log("Access Token:", accessToken);
    const controller = new AbortController();
  
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
    //Should fetch playlist info as well, but for now just fetching songs
    const  fetchPlaylistInfo = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          if (response.status === 401) {
            redirectToAuthCodeFlow(clientId);
          }
          throw new Error(`Failed to Get Playlist-info songs: ${response.status}`);
        }
  
        const data = await response.json();
        setPlaylistInfo(data);
      }catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      }
    }
    fetchPlaylistInfo();
    fetchSongs();
    return () => controller.abort();
  }, [id, clientId]);
  

  return (
    <div>
      <h1  className="banner">Playlist Songs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {songs.length === 0 && !error && <p>Loading songs...</p>}
      {playlistInfo && (
        <div className="playlist-info">
          <h2>{playlistInfo.name}</h2>
          <p>{playlistInfo.description || 'No description provided.'}</p>
          <img
            src={playlistInfo.images[0]?.url || 'https://via.placeholder.com/150'}
            alt={playlistInfo.name}
            className="playlist-thumb"
          />
        </div>
      )}
      <ul>
        {songs.map((song: any, index: number) => (
        <li key={index}>
          <div className="song-item">
            <img
            src={song.track.album.images[0]?.url || 'https://via.placeholder.com/150'}
            alt={song.track.name}
            className="song-thumb"
          />
           <p className='song-name'>{song.track.name}</p>
         </div>
       </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;