import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const API_URL = 'https://nxvcfappp-e602fcd9f171.herokuapp.com';
const DEFAULT_SUPPORT_LINK = '';
const GROUP_LINK = 'https://chat.whatsapp.com/BYzNlaEiCS9LPblEXIYJnA?mode=gi_t';

interface Contact {
  name: string;
  phone_number: string;
  link?: string;
}

interface ProgressSectionProps {
  contactCount: number;
  targetCount: number;
  progress: number;
}

const services = [
  {
    name: 'Bot Deployment & Automation',
    type: 'Service',
    description: 'Custom bot deployment for WhatsApp & web applications.',
    dp: '/images/nutterx.jpg',
  },
  {
    name: 'VCF System Verification',
    type: 'System',
    description: 'Automated VCF verification & progress tracking.',
    dp: '/images/vcf.png',
  },
  {
    name: 'Web & Mobile Development',
    type: 'Service',
    description: 'Custom websites, dashboards, and mobile applications.',
    dp: '/images/webdev.jpg',
  },
  {
    name: 'Direct Support & Enquiries',
    type: 'Direct',
    description: 'Get instant support via WhatsApp.',
    dp: '/images/nxadmin.jpg',
  },
];

const NUTTERX_WHATSAPP = '254713881613';

export default function ProgressSection({
  contactCount,
  targetCount,
  progress,
}: ProgressSectionProps) {

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [registeredUser, setRegisteredUser] = useState<Contact | null>(null);

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return (
      (cleaned.startsWith('254') && cleaned.length === 12) ||
      (cleaned.startsWith('255') && cleaned.length === 12) ||
      (cleaned.startsWith('256') && cleaned.length === 12) ||
      (cleaned.startsWith('234') && cleaned.length === 13) ||
      (cleaned.startsWith('263') && cleaned.length === 12) ||
      (cleaned.startsWith('673') && cleaned.length === 10) ||
      (cleaned.startsWith('233') && cleaned.length === 12)
    );
  };

  const formatPhoneNumber = (phone: string) => phone.replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Name and phone number required' });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setMessage({
        type: 'error',
        text: 'Invalid phone number. Include country code (e.g., 2547...) and use a supported country.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const isUpdating = !!registeredUser;

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone_number: formattedPhone,
          link: DEFAULT_SUPPORT_LINK
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Submission failed' });
      } else {
        setRegisteredUser({ name: name.trim(), phone_number: formattedPhone });

        setMessage({
          type: 'success',
          text: isUpdating
            ? 'Contact updated'
            : 'Registered successfully! Redirecting to group...',
        });

        setName('');
        setPhoneNumber('');

        // 🔥 REDIRECT ONLY IF NEW REGISTRATION
        if (!isUpdating) {
          setTimeout(() => {
            window.open(GROUP_LINK, '_blank');
          }, 2000);
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Server unavailable' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleEdit = () => {
    if (!registeredUser) return;
    setName(registeredUser.name);
    setPhoneNumber(registeredUser.phone_number);
  };

  const handleBackHome = () => {
    window.location.hash = '#/';
  };

  const contactNutterx = (serviceName: string) => {
    const message = `Hi NUTTERX, I am interested in your service: "${serviceName}".`;
    const url = `https://wa.me/${NUTTERX_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white p-8">

      <button
        onClick={handleBackHome}
        className="mb-6 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back Home
      </button>

      <h1 className="text-4xl font-bold mb-6">NUTTERX Services & Verification</h1>

      <p className="text-gray-200 mb-10 max-w-2xl">
        Explore what NUTTERX offers as a software engineer. Get verified, track your VCF progress,
        deploy bots, and get direct support.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: Registration + Progress */}
        <section className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold mb-3">Verification Progress</h2>

          <p className="text-gray-300 text-sm mb-4">
            Get verified to be included in the VCF system.
          </p>

          <div className="mb-4">
            <p className="text-white text-sm mb-1">
              {contactCount} / {targetCount} contacts ({progress.toFixed(1)}%)
            </p>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {message && (
              <div
                className={`p-3 rounded ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <input
              className="w-full border border-gray-400 p-3 rounded bg-white text-gray-900"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border border-gray-400 p-3 rounded bg-white text-gray-900"
              placeholder="Phone Number (e.g., 2547...)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="flex gap-3">
              {registeredUser && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-yellow-400 px-4 py-2 rounded text-white font-semibold hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
              >
                {loading
                  ? 'Processing…'
                  : registeredUser
                    ? 'Update Contact'
                    : 'Register Contact'}
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT: Services Cards */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

          {services.map((item) => (
            <div
              key={item.name}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-start hover:bg-black/50 transition cursor-pointer"
              onClick={() => contactNutterx(item.name)}
            >
              <img
                src={item.dp}
                alt={item.name}
                className="w-full h-40 rounded-xl object-cover mb-4 border border-white/20"
              />

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-600/20 text-green-300">
                  {item.type}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{item.description}</p>

              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Contact <ArrowRight size={16} />
              </div>
            </div>
          ))}

        </section>

      </div>
    </div>
  );
}
