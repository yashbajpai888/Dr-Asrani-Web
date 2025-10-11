// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
      break;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries) {
        console.log('Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log('❌ Could not connect to MongoDB after several attempts.');
        process.exit(1);
      }
    }
  }
};

connectWithRetry();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: 'native',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// API Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/transactions', require('./src/routes/transactionRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
