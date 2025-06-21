// pages/Callback.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../API/authCodeWithPkce.ts'; // <-- your API logic

function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client id

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      getAccessToken(clientId,code)
        .then(() => {
          navigate('/home'); // or redirect to protected page
        })
        .catch((err) => {
          console.error('Failed to get access token', err);
        });
    }
  }, [navigate]);

  return <p>Authorizing...</p>;
}

export default Callback;
