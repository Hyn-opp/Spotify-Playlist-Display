import React from 'react'
import { useNavigate } from 'react-router-dom'
import MenuBar from '../components/MenuBar'


const Home = () => {

  const navigate = useNavigate()
  const handleViewProfile = () => {
    navigate('/playlists')
  }
  return (
    <div>Home
      <MenuBar />
      <button onClick={handleViewProfile}>View profile</button>
    </div>
  )
}

export default Home