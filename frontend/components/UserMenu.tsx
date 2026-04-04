'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserSession {
  email: string;
  name: string;
}

export default function UserMenu() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('user-session');
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user-session');
    router.push('/');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50 transition"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {session.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {session.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">{session.name}</p>
            <p className="text-xs text-slate-500">{session.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
