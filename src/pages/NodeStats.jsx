import { useEffect, useState } from 'react';
import { nodeApi } from '../services/api';

const NodeStats = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status: 'upcoming'
    });

    const fetchData = async () => {
        try {
            const [statsRes, eventsRes] = await Promise.all([
                nodeApi.get('/stats'),
                nodeApi.get('/events')
            ]);
            setStats(statsRes.data);
            setEvents(eventsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Node backend connection error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const startEdit = (event) => {
        setEditingId(event.id);
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date ? event.date.split('T') : '',
            status: event.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', status: 'upcoming' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await nodeApi.put(`/events/${editingId}`, formData);
            } else {
                await nodeApi.post('/events', formData);
            }
            cancelEdit();
            fetchData();
        } catch (err) {
            alert("Save error: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this event?")) {
            try {
                await nodeApi.delete(`/events/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return (
        <div className="p-6 text-brand-text text-center animate-pulse">
            Connecting to Node.js Server...
        </div>
    );

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <header className="border-b border-brand-border pb-4">
                <h1 className="text-3xl font-black text-white tracking-tight">
                    Node.js Technical Dashboard
                </h1>
                <p className="text-brand-text opacity-60 text-sm">Real-time PostgreSQL Data Analysis</p>
            </header>

            {/* STATS TILES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Events" value={stats?.total} color="blue" />
                <StatCard label="Upcoming" value={stats?.upcoming} color="yellow" />
                <StatCard label="Ongoing" value={stats?.ongoing} color="green" />
                <StatCard label="Finished" value={stats?.finished} color="red" />
            </div>

            {/* FORM (CREATE & UPDATE) */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                editingId 
                ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                : 'border-brand-border bg-brand-card shadow-xl'
            }`}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    {editingId ? "📝 Edit Event" : "➕ Create New Event (via Node)"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title</label>
                            <input 
                                type="text" placeholder="Event title" required
                                className="w-full bg-black/20 border border-brand-border p-3 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Event Date</label>
                            <input 
                                type="date" required
                                className="w-full bg-black/20 border border-brand-border p-3 rounded-xl text-white focus:border-indigo-500 outline-none transition-all"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                        <textarea 
                            placeholder="Detailed description..."
                            className="w-full bg-black/20 border border-brand-border p-3 rounded-xl text-white h-24 focus:border-indigo-500 outline-none transition-all"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-2">
                        <select 
                            className="bg-black/40 border border-brand-border p-3 rounded-xl text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="finished">Finished</option>
                        </select>

                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
                            {editingId ? "Update Event" : "Create via Node.js"}
                        </button>

                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="px-6 bg-brand-border hover:bg-gray-700 text-white rounded-xl transition-all">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* DATA MANAGEMENT TABLE */}
            <div className="p-6 bg-brand-card rounded-2xl border border-brand-border shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">Database Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 border-b border-brand-border uppercase text-[10px] tracking-widest">
                                <th className="p-4">Event Details</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-brand-border/30 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{event.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{event.description}</p>
                                    </td>
                                    <td className="p-4 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                            event.status === 'finished' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                            event.status === 'ongoing' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button 
                                            onClick={() => startEdit(event)}
                                            className="px-3 py-1.5 text-xs font-bold bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/5 border-blue-500/20",
        yellow: "text-yellow-400 bg-yellow-500/5 border-yellow-500/20",
        green: "text-green-400 bg-green-500/5 border-green-500/20",
        red: "text-red-400 bg-red-500/5 border-red-500/20"
    };

    return (
        <div className={`p-5 rounded-2xl border shadow-lg ${colors[color]}`}>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">{label}</p>
            <p className="text-4xl font-black text-white">{value || 0}</p>
        </div>
    );
};

export default NodeStats;