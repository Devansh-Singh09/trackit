
import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Transit", "Delivered"],
    default: "Pending",
  },
  isInsured: {
    type: Boolean,
    default: false,
  },
  weight: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
  },
});

// Pre-save middleware to calculate shippingCost
shipmentSchema.pre('save', function (next) {
  this.shippingCost = this.weight * this.distance * 0.5;
  next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
