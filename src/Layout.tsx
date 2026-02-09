import { BarChart3, Users } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();

    const goTo = (path: string) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 text-white">
            {/* SIDEBAR */}
            <aside className="w-64 bg-black/40 backdrop-blur-md p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">NUTTERX</h2>

                <nav className="space-y-4">
                    <button
                        onClick={() => goTo('/progress')}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                        <BarChart3 size={20} />
                        Verification Progress
                    </button>

                    <button
                        onClick={() => goTo('/communities')}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                        <Users size={20} />
                        WhatsApp Communities
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 md:p-12">
                <Outlet />
            </main>
        </div>
    );
}
