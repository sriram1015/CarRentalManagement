const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');

// Get all cars
router.get('/getallcars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add new car
router.post('/addcar', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.json({ message: 'Car added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit car details
router.post('/editcar', async (req, res) => {
    try {
        const car = await Car.findById(req.body._id);
        Object.assign(car, req.body); // Update car properties
        await car.save();
        res.json({ message: 'Car details updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete car
router.post('/deletecar', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.body.carid);
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
