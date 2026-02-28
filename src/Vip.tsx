import { useState } from 'react';

const API_URL = 'https://nxvcfappp-e602fcd9f171.herokuapp.com';

/* 🔐 Hardcoded VIP Users */
const VIP_USERS = [
  { username: 'Nutterx42819408', password: '42819408' },
  { username: 'Gaza1', password: 'Gaza1' },
];

interface VipPhoto {
  image_url: string;
  caption?: string;
  created_at: string;
}

export default function Vip() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<VipPhoto[]>([]);

  const handleLogin = () => {
    const user = VIP_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      setError('');
      fetchPhotos();
    } else {
      setError('Invalid username or password');
    }
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vip/photos`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error('Failed to fetch VIP photos', err);
    }
  };

  /* ================= LOGIN SCREEN ================= */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white">
        <div className="bg-black/40 backdrop-blur-md p-10 rounded-2xl w-96 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">🔐 VIP Access</h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
          >
            LOGIN
          </button>
        </div>
      </div>
    );
  }

  /* ================= VIP PAGE ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">
        💎 VIP Exclusive Photos
      </h1>

      {photos.length === 0 ? (
        <p className="text-center text-gray-300">
          No VIP photos available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-4 shadow-lg"
            >
              {/* FULL IMAGE (NO CROPPING) */}
              <a
                href={photo.image_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={photo.image_url}
                  alt="VIP"
                  className="rounded-lg mb-3 w-full h-auto object-contain cursor-zoom-in"
                />
              </a>

              {/* CAPTION */}
              {photo.caption && (
                <p className="text-sm text-white mb-2">
                  📝 {photo.caption}
                </p>
              )}

              {/* DATE */}
              <p className="text-xs text-gray-300 mb-3">
                {new Date(photo.created_at).toLocaleString()}
              </p>

              {/* DOWNLOAD BUTTON */}
              <a
                href={photo.image_url}
                download
                className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                ⬇ Download Image
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
