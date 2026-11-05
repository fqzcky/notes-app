import { useState } from 'react';
import { api } from '../api';

export default function Register({ switchView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.auth.register(name, email, password);
    if (res.userId) {
      setMsg({ type: 'success', text: 'Registrasi berhasil! Mengalihkan ke login...' });
      setTimeout(() => switchView(), 1500);
    } else {
      setMsg({ type: 'error', text: res.message || 'Registrasi gagal' });
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">Buat Akun ✨</h2>
      {msg.text && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {msg.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Nama Lengkap" required value={name} onChange={e => setName(e.target.value)}
          className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white" 
        />
        <input 
          type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white" 
        />
        <input 
          type="password" placeholder="Password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white" 
        />
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition">
          Daftar Sekarang
        </button>
      </form>
      <p className="text-center text-slate-400 mt-6 text-sm">
        Sudah punya akun? <button onClick={switchView} className="text-blue-400 hover:underline font-medium">Login</button>
      </p>
    </div>
  );
}