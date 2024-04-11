// import the required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const session = require('express-session');


// app
const app = express();


// Middlewares
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
  secret: "mysecretsesion",
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser())
// routes middleware
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', categoryRoute)
app.use('/api', productRoute)
app.use('/api', cartRoute)
app.use('/api', orderRoute)
app.use('/' , (req, res) => {
  return res.send("Welcome to EliteStore API");
})

// database connection
const dburi = "mongodb+srv://lekanestyve:Jesuslove1@ecommerce.j5g1gua.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";
mongoose.connect(dburi, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, autoIndex: true });
const db = mongoose.connection
db.on('error', () => console.error('connection error'))
db.once('open', () => {
  console.log('connected')
})

const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log('Listening to port', port);
})

