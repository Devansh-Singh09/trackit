
import Shipment from '../models/Shipment.js';
import { isValidObjectId } from 'mongoose';

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
      user: req.user.id,
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

export const getAllShipments = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, searchField, searchTerm, sort } = req.query;
    console.log('Search params:', { searchField, searchTerm });

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (searchField && searchTerm) {
      if (searchField === '_id') {
        if (isValidObjectId(searchTerm)) {
          query._id = searchTerm;
        }
      } else if (searchField === 'title') {
        query.title = { $regex: searchTerm, $options: 'i' };
      }
    }

    console.log('Executing query:', query);

    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = 1; // Ascending order
    }

    const shipments = await Shipment.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalItems = await Shipment.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: shipments,
      metadata: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while fetching shipments', error: error.message });
  }
};

export const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while fetching the shipment', error: error.message });
  }
};

export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, isInsured, weight, distance } = req.body;

    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Check if the logged-in user is the owner of the shipment
    if (shipment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this shipment' });
    }

    shipment.title = title || shipment.title;
    shipment.status = status || shipment.status;
    shipment.isInsured = isInsured === undefined ? shipment.isInsured : isInsured;
    shipment.weight = weight || shipment.weight;
    shipment.distance = distance || shipment.distance;

    const updatedShipment = await shipment.save();

    res.status(200).json({ success: true, data: updatedShipment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while updating the shipment', error: error.message });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;

    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Check if the logged-in user is the owner of the shipment
    if (shipment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this shipment' });
    }

    await Shipment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while deleting the shipment', error: error.message });
  }
};
