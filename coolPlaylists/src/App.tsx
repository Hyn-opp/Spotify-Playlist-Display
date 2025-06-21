import { Routes, Route } from 'react-router-dom';
import './App.css'
import SpotifyPlaylists from './features/playlists/Playlists'
import Callback from './features/callback/Callback.tsx';
import PlaylistView from './features/playlist_view/PlaylistView.tsx';

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<SpotifyPlaylists />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/playlist/:id" element={<PlaylistView />} />
    </Routes>
  )
}

export default App
