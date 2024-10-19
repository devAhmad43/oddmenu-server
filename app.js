const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2200;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const adminRouter = require('./api/admin/admin');
const productRouter = require('./api/products/products');
const orders = require('./api/order/order')
const qrCode=require('./api/qr/qrCode')

const session = require('express-session');
const uri = process.env.Mongoo_URI;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: '*',
  credentials: true, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));
const connectDB = async () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Successfully connected to MongoDB")

    }).catch((error) => {
      console.error("Unable to connect to MongoDB", error);
    })
}
app.use('/api/product', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/order', orders);
app.use('/api/qr', qrCode);

app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})

connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
})

