import { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin, switchView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await api.auth.login(email, password);
    if (res.token) {
      onLogin(res.token, res.user);
    } else {
      setError(res.message || 'Login gagal');
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">Welcome Back 👋</h2>
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white" 
        />
        <input 
          type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 text-white" 
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
          Login
        </button>
      </form>
      <p className="text-center text-slate-400 mt-6 text-sm">
        Belum punya akun? <button onClick={switchView} className="text-blue-400 hover:underline font-medium">Daftar</button>
      </p>
    </div>
  );
}