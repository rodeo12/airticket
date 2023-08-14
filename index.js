const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//create express app
const app = express();

const PORT = process.env.port || 7979;
const MongoDB_URL = process.env.MongoDB_URL || 'mongodb+srv://mayank:mayank@cluster0.tmbqo77.mongodb.net/airtickets?retryWrites=true&w=majority';

app.use(express.json());
app.get('/', (req,res) => {
    res.send('Welcome To Flight Ticket Booking')
})

const routes = require('./routes/completeroutes');

//API Routes
app.use('/api', routes);

mongoose.connect(MongoDB_URL)
.then(() => {
    console.log('Connected To DB')
}).catch((err) => {
    console.log(err);
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})
