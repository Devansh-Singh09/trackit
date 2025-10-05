
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('/api/items');
      if (response.ok) {
        const { items } = await response.json();
        setItems(items);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/login');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem) return;

    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem }),
    });

    if (response.ok) {
      const { item } = await response.json();
      setItems([...items, item]);
      setNewItem('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Trackit</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h2>

        <div className="mt-8">
          <form onSubmit={handleAddItem} className="flex gap-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter a new item to track"
              className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </form>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">Your Items</h3>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item._id} className="p-4 bg-white rounded-lg shadow-md">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
