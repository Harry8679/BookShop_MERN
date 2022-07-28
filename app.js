const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const categoryRoutes = require('./routes/category.route');
const productRoutes = require('./routes/product.route');

// db
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Routes middlewares
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes);


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})