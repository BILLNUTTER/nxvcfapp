import { useState } from 'react';

const API_URL = 'https://nxvcfappp-e602fcd9f171.herokuapp.com';

/* 🔐 Hardcoded VIP Users */
const VIP_USERS = [
  { username: 'Nutterx42819408', password: '42819408' },
  { username: 'Gaza1', password: 'Gaza1' },
];

interface VipMedia {
  file_url: string;
  caption?: string;
  type: 'photo' | 'video' | 'audio';
  created_at: string;
}

export default function Vip() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [media, setMedia] = useState<VipMedia[]>([]);
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'audio'>('photo');

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

    // SAFETY: convert old photo format to new media format
    const mapped = (data.photos || []).map((p: any) => ({
      file_url: p.image_url,
      caption: p.caption,
      created_at: p.created_at,
      type: 'photo', // default for now
    }));

    setMedia(mapped);
  } catch (err) {
    console.error('Failed to fetch VIP media', err);
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

    const filteredMedia = media.filter((m) => m.type === activeTab);

  /* ================= VIP PAGE ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">
        💎 VIP Exclusive Photos
      </h1>

      <div className="flex justify-center gap-4 mb-10">
  <button
    onClick={() => setActiveTab('photo')}
    className={`px-6 py-2 rounded-full font-semibold ${
      activeTab === 'photo'
        ? 'bg-blue-600'
        : 'bg-white/10 hover:bg-white/20'
    }`}
  >
    📸 Photos
  </button>

  <button
    onClick={() => setActiveTab('video')}
    className={`px-6 py-2 rounded-full font-semibold ${
      activeTab === 'video'
        ? 'bg-blue-600'
        : 'bg-white/10 hover:bg-white/20'
    }`}
  >
    🎥 Videos
  </button>

  <button
    onClick={() => setActiveTab('audio')}
    className={`px-6 py-2 rounded-full font-semibold ${
      activeTab === 'audio'
        ? 'bg-blue-600'
        : 'bg-white/10 hover:bg-white/20'
    }`}
  >
    🎵 Songs
  </button>
</div>
      {filteredMedia.length === 0 ? (
        <p className="text-center text-gray-300">
          No VIP photos available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {filteredMedia.map((item, index) => (
    <div
      key={index}
      className="bg-black/40 backdrop-blur-md rounded-2xl p-4 shadow-lg"
    >
      {/* PHOTO */}
      {item.type === 'photo' && (
        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
          <img
            src={item.file_url}
            className="rounded-lg mb-3 w-full h-auto object-contain"
          />
        </a>
      )}

      {/* VIDEO */}
      {item.type === 'video' && (
        <video controls className="rounded-lg w-full mb-3">
          <source src={item.file_url} />
        </video>
      )}

      {/* AUDIO */}
      {item.type === 'audio' && (
        <audio controls className="w-full mb-3">
          <source src={item.file_url} />
        </audio>
      )}

      {item.caption && (
        <p className="text-sm text-white mb-2">📝 {item.caption}</p>
      )}

      <p className="text-xs text-gray-300 mb-3">
        {new Date(item.created_at).toLocaleString()}
      </p>

      <a
        href={item.file_url}
        download
        className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
      >
        ⬇ Download
      </a>
    </div>
  ))}
</div>
      )}
    </div>
  );
}
