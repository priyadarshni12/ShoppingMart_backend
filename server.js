const express = require('express');
const app = express();

const cors = require('cors')
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose')
const db = "mongodb://127.0.0.1:27017/Shopping"
const path = require('path');
const PORT = 4000

const userRoutes = require('./routes/User.route')
const productRoutes = require('./routes/Product.route')

require('dotenv').config();

app.use(cors());
// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// // for parsing multipart/form-data
// app.use(upload.array());

app.use(fileUpload());

app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect('mongodb+srv://admin:admin@cluster0.l4ejv.mongodb.net/ShoppingMart?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', function () {
  console.log("Mongoose Connected");
});

app.use('/User', userRoutes);
app.use('/Product', productRoutes);

app.listen(process.env.PORT || PORT, function () {
  console.log("server is running on Port :" + PORT);
});

