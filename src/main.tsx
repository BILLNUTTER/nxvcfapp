import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import AdminPanel from './AdminPanel';
import ProgressSection from './ProgressSection';
import WhatsappCommunities from './WhatsappCommunities';
import { WHATSAPP_CONTACTS } from './whatsappData';

import './index.css';

const TARGET_COUNT = 150;
const API_URL = 'https://nuttervcf-ccc911dbe67f.herokuapp.com';

function Main() {
  const [contactCount, setContactCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contacts/count`);
        const data = await res.json();
        setContactCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch contact count', err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min((contactCount / TARGET_COUNT) * 100, 100);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/progress"
          element={
            <ProgressSection
              contactCount={contactCount}
              targetCount={TARGET_COUNT}
              progress={progress}
            />
          }
        />
        <Route
          path="/communities"
          element={<WhatsappCommunities contacts={WHATSAPP_CONTACTS} />}
        />
      </Routes>
    </HashRouter>
  );
}

// 🔹 Detect admin mode from query parameters
const searchParams = new URLSearchParams(window.location.search);
const isAdminMode = searchParams.get('admin') === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminMode ? <AdminPanel /> : <Main />}
  </StrictMode>
);
