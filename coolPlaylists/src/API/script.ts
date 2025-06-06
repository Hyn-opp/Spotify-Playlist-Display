import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce.ts";

//This file holds the basic structure for the API calls to Spotify.

export async function apiStartup() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        const userId = profile.id;
        const playlists = await getPlaylists(userId, accessToken);
        console.log(playlists);
        return playlists;
    }
}

async function fetchProfile(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

async function getPlaylists(userId: string, accessToken: string): Promise<any> {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching playlists: ${response.statusText}`);
    }

    return await response.json();
}


