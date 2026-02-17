import { useEffect, useState } from "react";
import { Users, Send, MessageSquare, LogOut, Trash2, Edit } from "lucide-react";

const API_URL = "https://nxvcfappp-e602fcd9f171.herokuapp.com";

interface Contact {
    _id: string;
    name: string;
    phone_number: string;
}

export default function AdminPanel() {
    const [authorized, setAuthorized] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [error, setError] = useState("");

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);

    const [broadcast, setBroadcast] = useState("");
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    const [selectedPhone, setSelectedPhone] = useState("");
    const [waMessage, setWaMessage] = useState("");

    const [editingUser, setEditingUser] = useState<Contact | null>(null);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");

    const isAdminRoute = new URLSearchParams(window.location.search).get("admin") === "true";

    useEffect(() => {
        if (!isAdminRoute) setError("Unauthorized access");
    }, [isAdminRoute]);

    // ================= AUTH =================
    const handleLogin = async () => {
        if (!inputKey.trim()) return setError("Please enter admin key");
        try {
            const res = await fetch(`${API_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: inputKey }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAuthorized(true);
                setError("");
                fetchContacts(inputKey);
            } else {
                setError(data.error || "Invalid admin key");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed");
        }
    };

    const logout = () => {
        setAuthorized(false);
        setInputKey("");
        setContacts([]);
    };

    // ================= DATA =================
    const fetchContacts = async (key: string = inputKey) => {
        if (!key) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/contacts`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-key": key,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch contacts");
            setContacts(data.contacts || []);
        } catch (err: any) {
            console.error("Fetch contacts error:", err);
            setError(err.message || "Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    // ================= BROADCAST =================
    const sendBroadcast = async () => {
        if (!broadcast.trim()) return alert("Message cannot be empty");
        setSendingBroadcast(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/broadcast`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-key": inputKey,
                },
                body: JSON.stringify({ message: broadcast }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send broadcast");
            }
            alert("✅ Broadcast sent successfully");
            setBroadcast("");
        } catch (err: any) {
            console.error("Broadcast error:", err);
            alert(`❌ Failed to send broadcast: ${err.message}`);
        } finally {
            setSendingBroadcast(false);
        }
    };

    // ================= WHATSAPP =================
    const openWhatsApp = () => {
        if (!selectedPhone || !waMessage) return alert("Select user and type a message");
        window.open(`https://wa.me/${selectedPhone}?text=${encodeURIComponent(waMessage)}`, "_blank");
    };

    // ================= USER EDIT =================
    const startEdit = (contact: Contact) => {
        setEditingUser(contact);
        setEditName(contact.name);
        setEditPhone(contact.phone_number);
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditName("");
        setEditPhone("");
    };

    const saveEdit = async () => {
        if (!editingUser) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/contacts/${editingUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-admin-key": inputKey },
                body: JSON.stringify({ name: editName, phone_number: editPhone }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update contact");
            }
            alert("✅ Contact updated successfully");
            cancelEdit();
            fetchContacts();
        } catch (err: any) {
            console.error("Edit error:", err);
            alert(`❌ ${err.message}`);
        }
    };

    // ================= DELETE USER =================
    const deleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/contacts/${id}`, {
                method: "DELETE",
                headers: { "x-admin-key": inputKey },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete contact");
            }
            alert("✅ Contact deleted");
            fetchContacts();
        } catch (err: any) {
            console.error("Delete error:", err);
            alert(`❌ ${err.message}`);
        }
    };

    // ================= BLOCK NON-ADMIN =================
    if (!isAdminRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-xl font-bold">403 — Access Denied</h1>
            </div>
        );
    }

    // ================= LOGIN =================
    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-700 to-orange-600">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
                    <input
                        type="password"
                        placeholder="Enter admin key"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 mb-3"
                    />
                    {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                    >
                        Unlock Admin Panel
                    </button>
                </div>
            </div>
        );
    }

    // ================= DASHBOARD =================
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">NXADMIN DASHBOARD</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchContacts()} // <-- wrap in arrow function
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                        Refresh Users
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg flex flex-col items-start gap-2">
                    <Users size={32} />
                    <h2 className="text-xl font-bold">Registered Users</h2>
                    <p className="text-3xl font-extrabold">{contacts.length}</p>
                </div>
            </div>

            {/* BROADCAST */}
            <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg mb-8">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <MessageSquare /> Broadcast Message
                </h2>
                <textarea
                    value={broadcast}
                    onChange={(e) => setBroadcast(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                    rows={3}
                    placeholder="Message to display on user dashboards..."
                />
                <button
                    onClick={sendBroadcast}
                    disabled={sendingBroadcast}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                    {sendingBroadcast ? "Sending..." : "Send Broadcast"}
                </button>
            </div>

            {/* WHATSAPP */}
            <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg mb-8">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Send /> WhatsApp Message
                </h2>
                <select
                    value={selectedPhone}
                    onChange={(e) => setSelectedPhone(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                >
                    <option value="">Select user</option>
                    {contacts.map((c) => (
                        <option key={c._id} value={c.phone_number}>
                            {c.name} — {c.phone_number}
                        </option>
                    ))}
                </select>
                <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                    rows={3}
                    placeholder="WhatsApp message..."
                />
                <button
                    onClick={openWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                    Open WhatsApp
                </button>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Registered Users</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : contacts.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Phone</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((c) => (
                                <tr key={c._id} className="border-b">
                                    <td className="p-2">{c.name}</td>
                                    <td className="p-2">{c.phone_number}</td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => startEdit(c)}
                                            className="bg-yellow-400 text-black px-3 py-1 rounded flex items-center gap-1"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUser(c._id)}
                                            className="bg-red-600 px-3 py-1 rounded flex items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* EDIT MODAL */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="w-full border rounded-lg p-3 mb-3"
                        />
                        <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Phone number"
                            className="w-full border rounded-lg p-3 mb-3"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-400 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


