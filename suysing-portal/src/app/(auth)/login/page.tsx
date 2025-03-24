'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/customer-activities');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    if (success) {
      router.push('/customer-activities');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/images/background-image.png)' }}>
      <div className="max-w-4xl w-full px-6 py-8 bg-transparent">
        <div className="flex flex-col items-center justify-center mb-10">
          <Image 
            src="/images/suysing.png" 
            alt="Suy Sing Logo" 
            width={300} 
            height={300} 
            className="object-contain mb-2"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block  text-white mb-4">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 bg-white"
              
            />
          </div>

          <div>
            <label htmlFor="password" className="block  text-white mb-4">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-white"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-5 px-4 rounded transition duration-200 disabled:opacity-75"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
