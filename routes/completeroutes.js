const express = require('express');

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let dotenv = require('dotenv');

const routes = express.Router();
const User = require('../models/user');
const Flight = require('../models/flight');
const Booking = require('../models/booking');

dotenv.config();

//Register endpoint
routes.post('/register', async(req, res) => {


    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 7);
        const user = new User({ name, email, password: hashedPassword});
        await user.save();
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
})


//login endpoint
routes.post('/login', async(req, res) => {


    try {
        const { email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({error: 'User not found'});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            return res.status(401).json({error: 'Incorrect Password'});
        }
        const token = jwt.sign({userId: user._id}, process.env.secret_key)
        res.status(201).json({ message: 'User registered successfully', token});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
});


//Flights endpoints
routes.get('/flights', async(req, res) => {

    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
});

routes.get('/flights/:id', async(req, res) => {

    try {

        const flight = await Flight.findById(req.params.id);
        if(!flight) {
            return res.status(404).json({error: 'Flight not found'});

        }
        res.status(200).json(flight);
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
});


routes.post('/flights', async(req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json({ message: 'Flight details added successfully'});
    } catch (error) {
        res.status(400).json({error: 'An error occurred', details: error.message});
    }
})

routes.put('/flights/:id', async(req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!flight) {
            return res.status(404).json({error: 'Flight not found'});
        }
        res.status(200).json({message: 'Flight details updated successfully'});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
});


routes.delete('/flights/:id', async(req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if(!flight) {
            return res.status(404).json({error: 'Flight not found'});
        }
        res.status(202).json({message: 'Flight deleted successfully'});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
});


//Booking Endpoints
routes.post('/booking', async(req, res) => {
    try {
        const {user, flight} = req.body;
        const booking = new Booking({ user, flight});
        await booking.save();

        const populateBooking = await Booking.findById(booking._id)
        .populate('user')
        .populate('flight');

        res.status(201).json({ message: 'Booking successfully', booking: populatedBooking});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
})

routes.post('/dashboard', async(req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate('flight');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
})

routes.put('/dashboard/:id', async(req, res) => {
    try {
        const updatedbooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            populate: {path: 'user flight'},
        });
        if(!updatedbooking) {
            return res.status(404).json({error: 'Booking not found'});
        }
        res.status(204).json(updatedbooking);
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
})


routes.delete('/dashboard/:id', async(req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }
        res.status(202).json({message: 'Flight deleted successfully'});
    } catch (error) {
        res.status(400).json({error: 'An error occurred'});
    }
})

module.exports = routes;
