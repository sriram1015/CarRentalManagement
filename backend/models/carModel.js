const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bookedTimeSlots: { type: [String], default: [] }, // Array of booked time slots
  // Other car details like price, make, model, etc.
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
