const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
require('dotenv').config(); 
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express(); 
const PORT = process.env.PORT || 5000; 

const whitelist = ['http://localhost:4200']; // sites autorisés

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // autoriser les cookies / tokens
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware 
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(bodyParser.json());
app.use(authMiddleware);

// Connexion à MongoDB 
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("MongoDB connecté")) 
  .catch(err => console.log(err)); 

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/quotes', require('./routes/quoteRoute'));
app.use('/api/prestations', require('./routes/prestationRoute'));
app.use('/api/categories', require('./routes/categoryRoute'));
app.use('/api/email', require('./routes/emailRoute'));
