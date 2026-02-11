import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, ArrowRight, MessageCircle } from 'lucide-react';

const API_URL = 'https://nuttervcf-ccc911dbe67f.herokuapp.com';
const TARGET_COUNT = 110;

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
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [registeredUser, setRegisteredUser] = useState<Contact | null>(null);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);

  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const progress = Math.min((contactCount / TARGET_COUNT) * 100, 100);
  const isComplete = contactCount >= TARGET_COUNT;

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
      console.error('Error fetching contact count:', err);
    }
  };

  const fetchAdminMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/broadcast/latest`);
      const data = await res.json();
      setAdminMessages(data.message ? [data.message] : []);
    } catch (err) {
      console.error('Error fetching admin messages:', err);
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/api/contacts/download`, '_blank');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white">

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
      <main className="flex-1 p-8 md:p-12 space-y-12">

        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-bold mb-2">🛑𝐕𝐂𝐅 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐒𝐘𝐒𝐓𝐄𝐌</h1>
          <p className="text-gray-200">🟢 Central control panel for verification progress, services, and community access</p>
        </header>

{/* VERIFICATION + VCF GROUP */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* Verification Card */}
  <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg">
    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart3 /> Verification Progress</h2>

    <div className="w-full bg-gray-300 rounded-full h-5 mb-4">
      <div className="bg-green-500 h-5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
    </div>

    <p className="text-sm text-gray-700 mb-4">
      {contactCount} / {TARGET_COUNT} contacts ({progress.toFixed(1)}%)
    </p>

    {!isComplete ? (
      <button
        onClick={() => goTo('/progress')}
        className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        ⚪ GET VERIFIED <ArrowRight size={18} />
      </button>
    ) : (
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
      >
        ⬇ DOWNLOAD VCF FILE <ArrowRight size={18} />
      </button>
    )}
  </div>

  {/* VCF Group Card */}
  <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex gap-5 items-start hover:bg-black/50 transition">
    <img
      src="/images/nutterx.jpg"
      alt="Bot Deployment & VCF Verification"
      className="w-16 h-16 rounded-full object-cover border border-white/20"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold">Bot Deployment & VCF Verification</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-600/20 text-green-300">Group</span>
      </div>
      <p className="text-sm text-gray-300 mb-4">
        🔴𝐉𝐎𝐈𝐍 𝐕𝐂𝐅 𝐆𝐑𝐎𝐔𝐏🔥
      </p>
      <button
        onClick={() => window.open('https://chat.whatsapp.com/BYzNlaEiCS9LPblEXIYJnA?mode=gi_t')}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        JOIN GROUP <ArrowRight size={16} />
      </button>
    </div>
  </div>

  {/* Progress Card */}
  <div
    onClick={() => goTo('/progress')}
    className="cursor-pointer bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex gap-5 items-start hover:bg-black/50 transition"
  >
    <img
      src="/images/nutterx.jpg"
      alt="View Progress"
      className="w-16 h-16 rounded-full object-cover border border-white/20"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold">Check Verification Progress</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">Progress</span>
      </div>
      <p className="text-sm text-gray-300 mb-4">
        📈 View your verification status and see how close you are to completing your contacts.
      </p>
      <button
        onClick={() => goTo('/progress')}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        SEE PROGRESS <ArrowRight size={16} />
      </button>
    </div>
  </div>
</section>


        {/* ADMIN MESSAGES */}
        {adminMessages.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MessageCircle /> Admin Messages</h2>
            <p className="text-gray-700 mb-4">Official messages, updates, or guidance from the Nutterx admin team.</p>
            {adminMessages.map((msg, i) => (
              <div key={i} className="border-l-4 border-blue-600 pl-3 mb-3">
                <p className="text-gray-800">{msg.message}</p>
                <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))}
          </section>
        )}

        {/* ADDITIONAL SERVICE CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">How to Use the Web</h3>
            <p className="text-gray-700">
              Navigate the dashboard to check verification progress, join groups, and access all services easily.
            </p>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Benefits</h3>
            <p className="text-gray-700">
              The system improves visibility, organizes your contacts, and allows quick access to verified users and VCF files.
            </p>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">More Services</h3>
            <p className="text-gray-700">
              Access bot deployment, direct support, and guidance for managing your VCF files efficiently.
            </p>
            <button onClick={() => goTo('/communities')} className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Explore Communities <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <footer className="pt-10 text-center text-sm text-gray-300">
          © NUTTERX VCF SYSTEM — Main Dashboard
        </footer>
      </main>
    </div>
  );
}
