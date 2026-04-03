require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/db');

// Mock Data
const users = [
  {
    name: 'Admin Sai',
    email: 'admin@saielite.in',
    phone: '9876543210',
    password: 'password123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '9123456780',
    password: 'password123',
    role: 'user',
    isVerified: true
  }
];

const products = [
  {
    name: 'Delta Robotic Arm DR-5',
    category: 'Robotics',
    description: 'High-speed delta robot engineered for precise pick-and-place operations in electronics manufacturing.',
    price: 450000,
    discountPrice: 420000,
    rating: 4.8,
    numReviews: 12,
    countInStock: 5,
    image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&q=80',
    features: ['Payload 5kg', 'Reach 1200mm', 'Cycle Time 0.3s']
  },
  {
    name: 'AI Vision Sorting Machine v2',
    category: 'AI Machinery',
    description: 'Computer vision powered sorting system capable of identifying microscopic defects in manufacturing lines.',
    price: 850000,
    rating: 4.9,
    numReviews: 24,
    countInStock: 2,
    image: 'https://images.unsplash.com/photo-1614729939124-032f0b5609ce?auto=format&fit=crop&q=80',
    features: ['99.9% Accuracy', '1000 items/min', 'Deep Learning Config']
  },
  {
    name: 'Automated Guided Vehicle (AGV)',
    category: 'Logistics',
    description: 'Laser-guided warehouse logistics robot with advanced collision avoidance and fleet management.',
    price: 650000,
    discountPrice: 600000,
    rating: 4.6,
    numReviews: 8,
    countInStock: 10,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    features: ['LIDAR Navigation', 'Payload 1 Ton', 'Auto-docking']
  },
  {
    name: 'Cobot Manipulator Pro',
    category: 'Robotics',
    description: 'Collaborative robot arm designed to work safely alongside humans without safety cages.',
    price: 320000,
    rating: 4.7,
    numReviews: 15,
    countInStock: 8,
    image: 'https://images.unsplash.com/photo-1563223772-2d1265851608?auto=format&fit=crop&q=80',
    features: ['Payload 10kg', 'Force Sensors', 'Plug & Play UI']
  }
];

const importData = async () => {
  try {
    if (!process.env.MONGO_URI) {
        console.error("No MONGO_URI specified in .env. Falling back for testing.");
        // We will default to a local testing DB if needed
        await mongoose.connect('mongodb://localhost:27017/saielite_test');
    } else {
        await connectDB();
    }

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database Cleared.');

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      // Provide generic brand naming and link admin user to product.user
      return { ...product, user: adminUser, brand: 'Sai Elite Technologies' };
    });

    await Product.insertMany(sampleProducts);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeder: ${error}`);
    process.exit(1);
  }
};

importData();
