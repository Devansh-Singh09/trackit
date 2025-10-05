
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

import Navbar from '../../components/Navbar';



import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  username: string;
  role: string;
  exp: number;
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
    origin: '',
    destination: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('_id');
  const [sortBy, setSortBy] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  // Fetch shipments from the backend
  useEffect(() => {
    const fetchShipments = async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '3',
        status: statusFilter,
        searchField: searchField,
        searchTerm: searchTerm,
        sort: sortBy,
      });
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const { data, metadata } = await response.json();
        setShipments(data);
        setTotalPages(metadata.totalPages);
      }
    };
    fetchShipments();
  }, [currentPage, statusFilter, searchTerm, searchField, sortBy]);

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
      // distance will be calculated by backend
    };
    

    const token = localStorage.getItem('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
        origin: '',
        destination: '',
      });
    } else {
      const errorData = await response.json();
      alert(`Error creating shipment: ${errorData.message}`);
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${shipmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setShipments(shipments.filter(shipment => shipment._id !== shipmentId));
        } else {
          const errorData = await response.json();
          alert(`Error deleting shipment: ${errorData.message}`);
        }
      } catch (err) {
        alert('An error occurred while deleting the shipment');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800">{userRole === 'admin' ? 'Admin Dashboard' : 'Your Dashboard'}</h2>

        {userRole === 'user' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Create a new Shipment</h2>
            <form onSubmit={handleCreateShipment} className="p-8 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="title" value={formState.title} onChange={handleInputChange} placeholder="Title" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" required />
                <input type="number" name="weight" value={formState.weight} onChange={handleInputChange} placeholder="Weight (kg)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" min="0" required />
                {/* New fields for origin and destination */}
                <input type="text" name="origin" value={formState.origin} onChange={handleInputChange} placeholder="Origin (e.g. Washington, DC)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" required />
                <input type="text" name="destination" value={formState.destination} onChange={handleInputChange} placeholder="Destination (e.g. New York City, NY)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" required />
                {/* Distance field is now auto-calculated, so hide it */}
                {/* <input type="number" name="distance" value={formState.distance} onChange={handleInputChange} placeholder="Distance (km)" className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md" min="0" required /> */}
                <div className="flex items-center">
                  <input type="checkbox" name="isInsured" checked={formState.isInsured} onChange={handleInputChange} className="mr-2" />
                  <label htmlFor="isInsured">Is Insured?</label>
                </div>
              </div>
              <button type="submit" className="mt-6 w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Create Shipment</button>
            </form>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">{userRole === 'admin' ? 'All Shipments' : 'Your Shipments'}</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md">
              <option value="_id">ID</option>
              <option value="title">Title</option>
            </select>
            <input type="text" placeholder="Search by..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md md:col-span-1" />
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
              <li key={shipment._id} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/shipments/${shipment._id}`} className="text-lg font-bold text-indigo-600 hover:underline">
                      {shipment.title}
                    </Link>
                    <p><strong>Status:</strong> {shipment.status}</p>
                    <p><strong>Shipping Cost:</strong> ₹{shipment.shippingCost}</p>
                    <p className="text-sm text-gray-500"><strong>ID:</strong> {shipment._id}</p>
                  </div>
                  <div className="flex gap-2">
                    {userRole === 'admin' && (
                      <>
                        <Link href={`/shipments/${shipment._id}`} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Edit</Link>
                        <button onClick={() => handleDeleteShipment(shipment._id)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                      </>
                    )}
                    {userRole === 'user' && (
                      <Link href={`/shipments/${shipment._id}`} className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">View</Link>
                    )}
                  </div>
                </div>
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
