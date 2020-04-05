const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParder = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./routes/user');

// app
const app = express();

// database
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database connected"));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParder.json());
app.use(cookieParser());

// routes Middlewares
app.use('/api', userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});