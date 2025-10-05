'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shipment {
  _id: string;
  title: string;
  status: string;
  isInsured: boolean;
  weight: number;
  distance: number;
  shippingCost: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    status: 'Pending',
    weight: '' as number | string,
    distance: '' as number | string,
    isInsured: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch shipments from the backend
  useEffect(() => {
    const fetchShipments = async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '5',
        status: statusFilter,
        search: searchTerm,
        sort: sortBy,
      });
      const response = await fetch(`http://localhost:5000/api/shipments?${params.toString()}`);
      if (response.ok) {
        const { data, metadata } = await response.json();
        setShipments(data);
        setTotalPages(metadata.totalPages);
      }
    };
    fetchShipments();
  }, [currentPage, statusFilter, searchTerm, sortBy]);

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5000/api/users/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'weight' || name === 'distance') {
      if (value === '' || parseFloat(value) >= 0) {
        setFormState(prevState => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    const shipmentData = {
      ...formState,
      weight: parseFloat(formState.weight as string),
      distance: parseFloat(formState.distance as string),
    };
    

    const response = await fetch('http://localhost:5000/api/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });

    if (response.ok) {
      const { data: newShipment } = await response.json();
      setShipments([...shipments, newShipment]);
      alert(`Shipment created successfully!\nYour Shipment ID is: ${newShipment._id}`);
      setFormState({
        title: '',
        status: 'Pending',
        weight: '',
        distance: '',
        isInsured: false,
      });
    } else {
      const errorData = await response.json();
      alert(`Error creating shipment: ${errorData.message}`);
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
        <h2 className="text-2xl font-bold text-gray-800">Create a new Shipment</h2>

        <div className="mt-8">
          <form onSubmit={handleCreateShipment} className="p-8 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title" value={formState.title} onChange={handleInputChange} placeholder="Title" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" required />
              <input type="number" name="weight" value={formState.weight} onChange={handleInputChange} placeholder="Weight (kg)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" min="0" required />
              <input type="number" name="distance" value={formState.distance} onChange={handleInputChange} placeholder="Distance (km)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" min="0" required />
              <select name="status" value={formState.status} onChange={handleInputChange} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md">
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="flex items-center">
                <input type="checkbox" name="isInsured" checked={formState.isInsured} onChange={handleInputChange} className="mr-2" />
                <label htmlFor="isInsured">Is Insured?</label>
              </div>
            </div>
            <button type="submit" className="mt-6 w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Create Shipment</button>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">Your Shipments</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md">
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="shippingCost">Shipping Cost</option>
            </select>
          </div>

          <ul className="mt-4 space-y-4">
            {shipments.map((shipment) => (
              <li key={shipment._id}>
                <Link href={`/shipments/${shipment._id}`} className="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-50">
                  <p><strong>Title:</strong> {shipment.title}</p>
                  <p><strong>Status:</strong> {shipment.status}</p>
                  <p><strong>Shipping Cost:</strong> ${shipment.shippingCost}</p>
                  <p><strong>ID:</strong> {shipment._id}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-400">Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-400">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}