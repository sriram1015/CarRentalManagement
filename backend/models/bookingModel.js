const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  totalAmount: { type: Number, required: true },
  bookedTimeSlots: { type: [String], required: true }, // Array of booked time slots
  paymentScreenshot: { type: String, required: true }, // File path to the payment screenshot
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
