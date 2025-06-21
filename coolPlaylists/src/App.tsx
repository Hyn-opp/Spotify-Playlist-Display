import { Routes, Route } from 'react-router-dom';
import './App.css'
import SpotifyPlaylists from './features/playlists/Playlists'
import Callback from './features/callback/Callback.tsx';
import PlaylistView from './features/playlist_view/PlaylistView.tsx';
import SignInPage from './features/signInPage/SignInPage.tsx';
import Home from './features/home/Home.tsx';


function App() {
  

  return (
    <Routes>
      <Route path="/" element={<SignInPage/>} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/playlists" element={<SpotifyPlaylists />} />
      <Route path="/home" element={<Home/>} />
      {/* This route will display the playlist view when a user clicks on a playlist */}
      <Route path="/playlist/:id" element={<PlaylistView />} />
    </Routes>
  )
}

export default App
