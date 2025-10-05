
import Shipment from '../models/Shipment.js';

export const createShipment = async (req, res) => {
  console.log('Create shipment controller called');
  try {
    const { title, status, weight, distance, isInsured } = req.body;
    console.log('Request body:', req.body);

    // Basic validation
    if (!title || !weight || !distance) {
      console.log('Validation failed: Title, weight, and distance are required');
      return res.status(400).json({ success: false, message: 'Title, weight, and distance are required' });
    }

    const newShipment = new Shipment({
      title,
      status,
      weight,
      distance,
      isInsured,
    });

    console.log('New shipment object created:', newShipment);

    const savedShipment = await newShipment.save();

    console.log('Shipment saved successfully:', savedShipment);

    res.status(201).json({ success: true, message: 'Shipment created successfully', data: savedShipment });
  } catch (error) {
    console.error('An error occurred while creating the shipment:', error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the shipment', error: error.message });
  }
};
