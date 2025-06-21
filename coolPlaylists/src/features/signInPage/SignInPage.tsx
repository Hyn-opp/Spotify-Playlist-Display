// SignInWithSpotify.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- PKCE Helpers ---
const generateCodeVerifier = () => {
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// --- Main Component ---
const SignInWithSpotify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("idle");

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = "http://localhost:5173/callback"; // Change for production

  // --- Step 1: User clicks sign in ---
  const startLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem("verifier", verifier);

    const scope = [
      "playlist-read-private",
      "playlist-read-collaborative",
      "user-library-read"
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      code_challenge_method: "S256",
      code_challenge: challenge,
      scope
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  // --- Step 2: Handle callback ---
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    const getAccessToken = async (code: string) => {
      const verifier = sessionStorage.getItem("verifier");
      if (!verifier) return setStatus("Missing PKCE verifier");

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier
      });

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        setStatus("Login successful!");
        navigate("/home"); // Change route as needed
      } else {
        console.error("Token exchange failed", data);
        setStatus("Token exchange failed");
      }
    };

    if (code) {
      setStatus("Exchanging code...");
      getAccessToken(code);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign in with Spotify</h1>
      <button
        onClick={startLogin}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Connect Spotify
      </button>
      {status !== "idle" && <p>{status}</p>}
    </div>
  );
};

export default SignInWithSpotify;
