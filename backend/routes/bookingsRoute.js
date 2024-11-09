const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Booking = require('../models/bookingModel'); // Booking model
const Car = require('../models/carModel'); // Car model
const router = express.Router();

// Ensure 'uploads' directory exists, if not, create it
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file upload (payment screenshot)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to:', uploadDir); // Log where the file is being saved
    cb(null, uploadDir); // Specify the upload path
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log('Generated file name:', fileName); // Log the file name being saved
    cb(null, fileName); // Set the file name
  },
});

const upload = multer({ storage });

// Handle booking and payment screenshot upload
router.post('/bookcar', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { carId, totalAmount, bookedTimeSlots } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    console.log('Received file:', req.file); // Log file details

    // Create new booking entry
    const newBooking = new Booking({
      car: carId,
      totalAmount,
      bookedTimeSlots,
      paymentScreenshot: req.file.path, // Save file path of uploaded screenshot
    });

    await newBooking.save();

    // Update car's booked time slots
    const car = await Car.findById(carId);
    car.bookedTimeSlots.push(bookedTimeSlots);
    await car.save();

    // Respond with success message
    res.json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error in /bookcar route:', error.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'There was an error processing the booking' });
  }
});
router.get('/getallbookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car').populate('user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bookings' });
  }
});

module.exports = router;
