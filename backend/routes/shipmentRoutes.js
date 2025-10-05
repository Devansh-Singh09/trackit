
import express from 'express';
import { createShipment, getAllShipments, getShipmentById, updateShipment, deleteShipment } from '../controllers/shipmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all shipment routes
router.use(protect);

// POST /api/shipments
router.post('/', createShipment);

// GET /api/shipments
router.get('/', getAllShipments);

// GET /api/shipments/:id
router.get('/:id', getShipmentById);

// PUT /api/shipments/:id
router.put('/:id', updateShipment);

// DELETE /api/shipments/:id
router.delete('/:id', deleteShipment);

export default router;
