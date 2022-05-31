const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/user.route');

// db
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

// Routes middlewares
app.use('/api', userRoutes)


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})