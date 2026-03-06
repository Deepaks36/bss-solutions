import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onClose: () => void;
  dark: boolean;
}

export function AdminLogin({ onLogin, onClose, dark }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid username or password');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const surface = dark
    ? 'bg-gray-900 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';
  const inputCls = dark
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-8 ${surface} ${
          shaking ? 'animate-shake' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
          <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Sign in to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            Sign In
          </button>
        </form>

        <p className={`text-xs text-center mt-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          Credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}
