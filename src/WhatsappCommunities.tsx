// src/whatsappData.tsx (combined types + component)
export interface WhatsappContact {
  name: string;
  type: string;
  link: string;
  dp: string;
  description: string;
}

// Hardcoded WhatsApp contacts
export const WHATSAPP_CONTACTS: WhatsappContact[] = [
  {
    name: '🔴𝐁𝐎𝐓 𝐃𝐄𝐏𝐋𝐎𝐘𝐌𝐄𝐍𝐓🔴',
    type: 'Group',
    link: 'https://chat.whatsapp.com/JsKmQMpECJMHyxucHquF15?mode=gi_t',
    dp: '/images/nutterx.jpg',
    description: 'Bot deployment, web design & development services'
  },
  {
    name: 'Follow 𝑲𝑰𝑺𝑺 😘💋',
    type: 'Channel',
    link: 'https://whatsapp.com/channel/0029Vb6b864Id7nIEgOrMe24',
    dp: '/images/kiss.jpg',
    description: 'Love vibes and entertainment'
  },
  {
    name: 'Follow 💎 𝗚𝗲𝗻𝗭 𝗖𝗼𝗻𝗻𝗲𝗰𝘁 ✨🔥',
    type: 'Channel',
    link: 'https://whatsapp.com/channel/0029VbBMPpaBqbr0BuG2q12F',
    dp: '/images/genz.jpg',
    description: 'Gen Z discussions, trends & fun'
  },
  {
    name: 'Follow 𝐁𝐀𝐃𝐃𝐈𝐄🌹✨',
    type: 'Channel',
    link: 'https://whatsapp.com/channel/0029Vb6seel84OmJtT8ngv45',
    dp: '/images/baddie.jpg',
    description: 'Bold vibes and lifestyle content'
  },
  {
    name: 'Follow 𝐏𝐑𝐄𝐌𝐈𝐄𝐑 𝐋𝐄𝐀𝐆𝐔𝐄™ 🏴',
    type: 'Channel',
    link: 'https://whatsapp.com/channel/0029VbC1I9D8V0tvqlDYQ637',
    dp: '/images/premier.jpeg',
    description: 'Football lovers -Join here'
  },
  {
    name: 'Follow 🔥𝐌𝐀𝐍 𝐔𝐍𝐈𝐓𝐄𝐃🔥',
    type: 'Channel',
    link: 'https://whatsapp.com/channel/0029VbBAlNqLCoWv7MSgva1A',
    dp: '/images/manu.png',
    description: 'Man United fans -Join here'
  },
  {
    name: 'Contact Nutterx',
    type: 'Direct',
    link: 'https://wa.me/254713881613',
    dp: '/images/nxadmin.jpg',
    description: 'Direct support & enquiries.Bot Deployment DM'
  }
];

interface WhatsappSectionProps {
  contacts: WhatsappContact[];
}

export default function WhatsappCommunities({ contacts }: WhatsappSectionProps) {
  return (
    <section className="p-6">
      {/* Back Home Button */}
      <button
        onClick={() => (window.location.href = '/')}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
      >
        ⬅ Back Home
      </button>

      <h2 className="text-white text-xl font-semibold mb-1">WhatsApp Communities</h2>
      <p className="text-gray-200 text-sm mb-4">
        Follow and join official Nutterx WhatsApp channels and groups. Files and updates are shared here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map(c => (
          <a
            key={c.link}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-4 text-center shadow hover:scale-105 transition"
          >
            <img src={c.dp} className="w-24 h-24 mx-auto rounded-full" />
            <p className="font-bold mt-2">{c.name}</p>
            <p className="text-sm text-gray-500">{c.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

// Example usage (e.g., in App.tsx):
// import WhatsappCommunities, { WHATSAPP_CONTACTS } from './whatsappData';
// <WhatsappCommunities contacts={WHATSAPP_CONTACTS} />

