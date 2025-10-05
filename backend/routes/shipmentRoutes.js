
import express from 'express';
import { createShipment } from '../controllers/shipmentController.js';
const router = express.Router();

// POST /api/shipments
router.post('/', createShipment);

export default router;
