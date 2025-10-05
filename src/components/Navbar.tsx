
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Trackit</h1>
        <div className="flex items-center">
          {username && <span className="text-gray-800 mr-4">Welcome, {username}</span>}
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
