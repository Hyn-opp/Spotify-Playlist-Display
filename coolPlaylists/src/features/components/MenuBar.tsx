// MenuBar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./menuBar.css"; // Import the CSS file

const MenuBar: React.FC = () => {
  return (
    <nav className="menu-bar">
      <div className="menu-container">
        <h1 className="logo">🎵 My Spotify App</h1>
        <div className="nav-links">
          <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/playlists" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Playlists
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
