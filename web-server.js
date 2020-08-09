const express = require('express');
const app = express();
const dotenv = require('dotenv');
const port = 3000;
const mongoose = require('mongoose');


// Import routes

const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products');

dotenv.config();

// Connect to db

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to db')
);

// Middleware
app.use(express.json());

// Route middleware

app.use('/api/user', authRoute);
app.use('/api/products', productsRoute);

app.listen((port), () => console.log('Server up and running'));