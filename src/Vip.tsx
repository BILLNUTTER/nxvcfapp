import { useState } from 'react';

const API_URL = 'https://nxvcfappp-e602fcd9f171.herokuapp.com';

/* 🔐 Hardcoded VIP Users */
const VIP_USERS = [
  { username: 'Nutterx', password: '42819408' },
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
  const [activeTab, setActiveTab] =
    useState<'photo' | 'video' | 'audio'>('photo');
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    const user = VIP_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setError('Invalid username or password');
      return;
    }

    setIsLoggedIn(true);
    setError('');
    fetchMedia();
  };

  /* ================= FETCH VIP MEDIA ================= */
  const fetchMedia = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/vip/photos`);
      const data = await res.json();

      setMedia(data.photos || []);
    } catch (err) {
      console.error('Failed to fetch VIP media', err);
    } finally {
      setLoading(false);
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
        💎 VIP Exclusive Content 🔥
      </h1>

      {/* TABS */}
      <div className="flex justify-center gap-4 mb-10">
        {(['photo', 'video', 'audio'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? 'bg-blue-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {tab === 'photo' && '📸 Photos'}
            {tab === 'video' && '🎥 Videos'}
            {tab === 'audio' && '🎵 Songs'}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-loading-bar" />
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Loading VIP {activeTab}s...
          </p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <p className="text-center text-gray-300">
          No VIP {activeTab}s available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMedia.map((item, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-4 shadow-lg"
            >
              {item.type === 'photo' && (
                <img
                  src={item.file_url}
                  className="rounded-lg mb-3 w-full object-contain"
                />
              )}

              {item.type === 'video' && (
                <video controls className="rounded-lg w-full mb-3">
                  <source src={item.file_url} />
                </video>
              )}

              {item.type === 'audio' && (
                <audio controls className="w-full mb-3">
                  <source src={item.file_url} />
                </audio>
              )}

              {item.caption && (
                <p className="text-sm text-white mb-2">📝 {item.caption}</p>
              )}

              <p className="text-xs text-gray-300">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
