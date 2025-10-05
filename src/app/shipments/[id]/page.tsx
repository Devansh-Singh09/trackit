
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Shipment {
  _id: string;
  title: string;
  status: string;
  isInsured: boolean;
  weight: number;
  distance: number;
  shippingCost: number;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const { id } = params;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchShipment = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/shipments/${id}`);
          if (response.ok) {
            const { data } = await response.json();
            setShipment(data);
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{shipment.title}</h1>
        <div className="space-y-2">
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>Weight:</strong> {shipment.weight} kg</p>
          <p><strong>Distance:</strong> {shipment.distance} km</p>
          <p><strong>Shipping Cost:</strong> ${shipment.shippingCost}</p>
          <p><strong>Insured:</strong> {shipment.isInsured ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}
