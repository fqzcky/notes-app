import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard({ user, token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    const data = await api.notes.getAll(token);
    if (Array.isArray(data)) setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
  loadNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.notes.create(token, title, content);
    setTitle(''); setContent('');
    loadNotes();
  };

  const handleToggle = async (note) => {
    await api.notes.update(token, note.id, { title: note.title, content: note.content, isDone: !note.isDone });
    loadNotes();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus catatan ini?')) return;
    await api.notes.delete(token, id);
    loadNotes();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Halo, {user.name} 👋</h1>
            <p className="text-slate-400">Catatan pribadimu tersimpan dengan aman.</p>
          </div>
          <button onClick={onLogout} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition border border-red-500/20 font-medium">
            Logout
          </button>
        </header>

        <form onSubmit={handleAdd} className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Catatan Baru</h2>
          <input 
            type="text" placeholder="Judul catatan..." value={title} onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white mb-3" 
          />
          <textarea 
            placeholder="Isi catatan (opsional)..." value={content} onChange={e => setContent(e.target.value)}
            className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white mb-3 resize-none h-24" 
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
            + Tambah Catatan
          </button>
        </form>

        <div className="grid gap-4">
          {loading ? (
            <p className="text-center text-slate-500 py-10">Memuat data...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-slate-500 py-10">Belum ada catatan. Yuk buat satu!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className={`p-5 rounded-xl border transition ${note.isDone ? 'bg-slate-800/50 border-slate-700 opacity-60' : 'bg-slate-800 border-slate-600 shadow-md'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${note.isDone ? 'line-through text-slate-400' : 'text-white'}`}>{note.title}</h3>
                    <p className={`mt-1 whitespace-pre-wrap ${note.isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>{note.content}</p>
                    <small className="text-xs text-slate-500 mt-2 block">
                      {new Date(note.createdAt).toLocaleString('id-ID')}
                    </small>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleToggle(note)} className={`p-2 rounded-lg text-sm font-medium transition ${note.isDone ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}`}>
                      {note.isDone ? 'Batal' : 'Selesai'}
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="p-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}