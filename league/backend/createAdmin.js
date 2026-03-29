require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/league_management');
    
    const email = process.argv[2] || 'admin@league.com';
    const password = process.argv[3] || 'Admin123';
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user to admin
      user.role = 'admin';
      await user.save();
      console.log(`User ${email} updated to admin`);
    } else {
      // Create new admin user
      user = new User({
        username: 'admin',
        email: email,
        password: password,
        role: 'admin'
      });
      await user.save();
      console.log(`Admin user created: ${email} / ${password}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
