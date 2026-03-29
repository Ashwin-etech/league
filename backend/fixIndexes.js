const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/league_management');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('teams');

    // Get current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => ({ name: i.name, key: i.key })));

    // Drop old unique indexes on name and shortCode if they exist
    try {
      await collection.dropIndex('name_1');
      console.log('Dropped name_1 index');
    } catch (e) {
      console.log('name_1 index not found or already dropped');
    }

    try {
      await collection.dropIndex('shortCode_1');
      console.log('Dropped shortCode_1 index');
    } catch (e) {
      console.log('shortCode_1 index not found or already dropped');
    }

    // Create new compound unique indexes
    await collection.createIndex({ name: 1, sportType: 1 }, { unique: true, name: 'name_1_sportType_1' });
    console.log('Created compound index on name + sportType');

    await collection.createIndex({ shortCode: 1, sportType: 1 }, { unique: true, name: 'shortCode_1_sportType_1' });
    console.log('Created compound index on shortCode + sportType');

    console.log('Index fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
