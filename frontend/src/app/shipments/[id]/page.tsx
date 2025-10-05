
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Shipment {
  _id: string;
  title: string;
  status: string;
  isInsured: boolean;
  weight: number;
  distance: number;
  shippingCost: number;
}


import Navbar from '../../../components/Navbar';


import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<Shipment>>({});
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

    setIsEditing(false); // Reset edit mode on page load
    if (id) {
      const fetchShipment = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const { data } = await response.json();
            setShipment(data);
            setFormState(data);
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to fetch shipment');
          }
        } catch (err) {
          setError('An error occurred while fetching the shipment');
        }
        setLoading(false);
      };
      fetchShipment();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        const { data } = await response.json();
        setShipment(data);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(`Error updating shipment: ${errorData.message}`);
      }
    } catch (err) {
      alert('An error occurred while updating the shipment');
    }
  };

  const handleDeleteShipment = async () => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          router.push('/dashboard');
        } else {
          const errorData = await response.json();
          alert(`Error deleting shipment: ${errorData.message}`);
        }
      } catch (err) {
        alert('An error occurred while deleting the shipment');
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setShipment(data);
      } else {
        const errorData = await response.json();
        alert(`Error updating status: ${errorData.message}`);
      }
    } catch (err) {
      alert('An error occurred while updating the status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!shipment) {
    return <div>Shipment not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{shipment.title}</h1>
          <div className="space-y-2">
            <p><strong>Status:</strong> {shipment.status}</p>
            <p><strong>Weight:</strong> {shipment.weight} kg</p>
            <p><strong>Distance:</strong> {shipment.distance} km</p>
            <p><strong>Shipping Cost:</strong> ${shipment.shippingCost}</p>
            <p><strong>Insured:</strong> {shipment.isInsured ? 'Yes' : 'No'}</p>
          </div>

          {userRole === 'admin' && (
            <div className="mt-6 flex gap-4 items-center">
              <select value={shipment.status} onChange={(e) => handleStatusChange(e.target.value)} className="px-3 py-1 text-sm font-medium text-gray-900 bg-gray-200 border border-gray-300 rounded-md">
                <option value="Pending" disabled={shipment.status !== 'Pending'}>Pending</option>
                <option value="In Transit" disabled={shipment.status !== 'Pending' && shipment.status !== 'In Transit'}>In Transit</option>
                <option value="Delivered" disabled={shipment.status !== 'In Transit'}>Delivered</option>
              </select>
              <button onClick={handleDeleteShipment} className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
