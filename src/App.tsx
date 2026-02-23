import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users } from 'lucide-react';

const API_URL = 'https://nxvcfappp-e602fcd9f171.herokuapp.com';
const TARGET_COUNT = 300;

/* 🎵 MUSIC PLAYLIST */
const PLAYLIST = [
  '/music/song1.mp3',
  '/music/song2.mp3',
  '/music/song3.mp3',
];

interface Contact {
  name: string;
  phone_number: string;
}

interface AdminMessage {
  message: string;
  created_at: string;
}


export default function App() {
  const [contactCount, setContactCount] = useState<number>(0);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const progress = Math.min((contactCount / TARGET_COUNT) * 100, 100);
  const isComplete = contactCount >= TARGET_COUNT;

  /* 🎵 MUSIC SYSTEM */
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0]);
    audio.volume = 0.7;
    audioRef.current = audio;
    audio.addEventListener('ended', () => {
      setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
    });
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = PLAYLIST[currentTrack];
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    const startMusic = async () => {
      if (!audioRef.current || started) return;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setStarted(true);
        window.removeEventListener('click', startMusic);
      } catch {}
    };
    window.addEventListener('click', startMusic);
    return () => window.removeEventListener('click', startMusic);
  }, [started]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  };

  /* FETCH DATA */
  useEffect(() => {
    fetchContactCount();
    fetchAdminMessages();
    const countInterval = setInterval(fetchContactCount, 5000);
    const adminInterval = setInterval(fetchAdminMessages, 10000);
    return () => {
      clearInterval(countInterval);
      clearInterval(adminInterval);
    };
  }, []);

  const fetchContactCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contacts/count`);
      const data = await res.json();
      setContactCount(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/broadcast/latest`);
      const data = await res.json();
      setAdminMessages(data.message ? [data.message] : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/api/contacts/download`, '_blank');
  };

  /* ========================= JSX ========================= */  

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white">

      {/* 🎵 PREMIUM FLOATING MUSIC CONTROL */}
      <div className="fixed bottom-6 right-6 z-50 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-5 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-gray-300">
            Background Music
          </p>
          <span className="text-[10px] text-purple-400">
            Track {currentTrack + 1}/{PLAYLIST.length}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleMusic}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={nextTrack}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105 transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-64 bg-black/40 backdrop-blur-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">NUTTERX</h2>
        <nav className="space-y-4">
          <button onClick={() => goTo('/progress')} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-white/10">
            <BarChart3 size={20} /> Verification Progress
          </button>
          <button onClick={() => goTo('/communities')} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-white/10">
            <Users size={20} /> WhatsApp Communities
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 px-6 md:px-12 py-10 space-y-16">
        <header className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-3">
            🛑𝐕𝐂𝐅 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐒𝐘𝐒𝐓𝐄𝐌
          </h1>
          <p className="text-gray-200 text-lg">
            🟢 Central control panel for verification progress, services, and community access
          </p>
        </header>

        

        {/* MAIN DASHBOARD CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Verification Card */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 /> Verification Progress
              </h2>

              <div className="w-full bg-gray-300 rounded-full h-5 mb-4">
                <div
                  className="bg-green-500 h-5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {contactCount} / {TARGET_COUNT} contacts ({progress.toFixed(1)}%)
              </p>

              <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm text-gray-700 space-y-2">
                <p>
                  📈 This system helps increase your WhatsApp status viewers by expanding
                  your verified contact network.
                </p>
                <p>
                  🔥 More viewers means more visibility — helping you grow your business,
                  brand, or personal influence.
                </p>
                <p>
                  🌍 Connect with people across different countries and build a strong
                  international network through verified contacts.
                </p>
              </div>
            </div>

            {!isComplete ? (
              <button
                onClick={() => goTo('/progress')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                ⚪ GET VERIFIED <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white w-full"
              >
                ⬇ DOWNLOAD VCF FILE <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* VCF Group Card */}
<div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-black/50 transition flex flex-col justify-between">

  <div className="flex gap-5">
    <img
      src="/images/nutterx.jpg"
      alt="VCF Verification Group"
      className="w-16 h-16 rounded-full object-cover border border-white/20"
    />

    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">
          𝐕𝐂𝐅 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐆𝐑𝐎𝐔𝐏
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-600/20 text-green-300">
          Official Group
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        ⚠️ Members are strongly advised to join the official VCF group for
        faster updates, important guidelines, and verification announcements.
      </p>

      <p className="text-sm text-gray-400 leading-relaxed">
        📥 The updated VCF files are always dropped inside the group.
        Staying in the group ensures you don’t miss new releases,
        instructions, or system updates.
      </p>
    </div>
  </div>

<button
  onClick={() =>
    window.open(
      'https://chat.whatsapp.com/BYzNlaEiCS9LPblEXIYJnA?mode=gi_t'
    )
  }
  className="mt-6 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition w-full font-semibold"
>
  🔴𝐉𝐎𝐈𝐍 𝐕𝐂𝐅 𝐆𝐑𝐎𝐔𝐏✅ <ArrowRight size={16} />
</button>
</div>

          {/* Progress Card */}
          <div
            onClick={() => goTo('/progress')}
            className="cursor-pointer bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-black/50 transition flex flex-col justify-between"
          >
            <div className="flex gap-5">
              <img
                src="/images/progress.jpeg"
                alt="View Progress"
                className="w-16 h-16 rounded-full object-cover border border-white/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Check Verification Progress</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">
                    Progress
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-6">
                  📈 View your verification status and see how close you are to completing your contacts.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition w-full">
              SEE PROGRESS <ArrowRight size={16} />
            </button>
          </div>

        </section>

        {/* ADMIN MESSAGES */}
{adminMessages.length > 0 && (
  <section className="mt-10 space-y-4">

    {/* Section Header */}
    <div className="text-white">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        📢 𝐒𝐓𝐀𝐘 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃💎
      </h2>
      <p className="text-gray-300 text-sm">
        Stay updated with important information, system updates, and growth tips.
      </p>
    </div>

    {/* Admin Card */}
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-gray-900">
        <MessageCircle /> Admin Messages
      </h3>

      <p className="text-gray-700 mb-4">
        Official messages, updates, or guidance from the Nutterx admin team.
      </p>

      {adminMessages.map((msg, i) => (
        <div key={i} className="border-l-4 border-blue-600 pl-3 mb-3">
          <p className="text-gray-800">{msg.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(msg.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>

  </section>
)}

        {/* ADDITIONAL SERVICE SECTION */}
<section className="mt-16 space-y-10">

  {/* Section Header */}
  <div className="text-center max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
      Platform Services & Information
    </h2>
    <p className="text-gray-300 text-sm md:text-base">
      Everything you need to understand how the system works, its benefits,
      and the additional services available to support your growth.
    </p>
  </div>

  {/* Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* Card 1 */}
    <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        How to Use the Web
      </h3>
      <p className="text-gray-700 leading-relaxed">
        Navigate the dashboard to check verification progress, join groups,
        download VCF files, and access all available services efficiently.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        Benefits
      </h3>
      <p className="text-gray-700 leading-relaxed">
        The system increases visibility, expands your verified contact
        network, improves status reach, and helps support business
        growth through structured digital connections.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          More Services
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Access bot deployment, direct support, VCF management tools,
          and verified community connections to expand your reach.
        </p>
      </div>

      <button
        onClick={() => goTo('/communities')}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Explore Communities <ArrowRight size={16} />
      </button>
    </div>

  </div>
</section>


        <footer className="pt-10 text-center text-sm text-gray-300">
          © NUTTERX VCF SYSTEM — Main Dashboard
        </footer>

      </main>
    </div>
  );
      }
