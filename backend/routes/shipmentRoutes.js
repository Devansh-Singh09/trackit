
import express from 'express';
import axios from 'axios';
import Shipment from '../models/Shipment.js'; // <-- Add this import
import { createShipment, getAllShipments, updateShipment, deleteShipment } from '../controllers/shipmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all shipment routes
router.use(protect);

// POST /api/shipments
router.post('/', async (req, res) => {
  try {
    const { title, status, weight, isInsured, origin, destination } = req.body;
    const userId = req.user.id;

    // Calculate distance using Google Maps API (metric)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!origin || !destination || !apiKey) {
      return res.status(400).json({ message: 'Origin, destination, and API key are required.' });
    }
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${apiKey}`;
    const response = await axios.get(url);
    const element = response.data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      return res.status(400).json({ message: 'Could not calculate distance. Please check locations.' });
    }
    // Distance in meters, convert to kilometers and round to 2 decimals
    const distance = +(element.distance.value / 1000).toFixed(2);

    // Create shipment
    const shipment = new Shipment({
      user: userId,
      title,
      status,
      weight,
      isInsured,
      origin,
      destination,
      distance,
    });
    await shipment.save();

    res.status(201).json({ data: shipment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating shipment', error: err.message });
  }
});

// GET /api/shipments
router.get('/', getAllShipments);

// GET /api/shipments/:id
router.get('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('user', '_id username email');
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.json({ data: shipment });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shipment', error: err.message });
  }
});

// PUT /api/shipments/:id
router.put('/:id', updateShipment);

// DELETE /api/shipments/:id
router.delete('/:id', deleteShipment);

export default router;
