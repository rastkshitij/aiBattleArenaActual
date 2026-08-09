import React, { useState } from 'react';

export default function AuthForm({ mode, onSubmit, isLoading, switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#141414] border border-[#222] text-2xl flex items-center justify-center">❋</div>
          <h1 className="text-2xl font-semibold text-gray-100">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {mode === 'login' ? 'Sign in to continue your battles' : 'Register to start your AI arena'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-gray-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-white text-black font-medium py-3 transition hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          className="mt-5 text-sm text-gray-400 hover:text-gray-200"
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
