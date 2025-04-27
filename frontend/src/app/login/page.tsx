'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import api from '../../lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      schema.parse({ email, password });
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.role);
      router.push('/hospitals');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError('Please enter a valid email and a password with at least 6 characters.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white py-2 rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-secondary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
