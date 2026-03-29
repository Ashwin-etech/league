const mongoose = require('mongoose');
const Team = require('./models/Team');
require('dotenv').config();

const teamsToAdd = [
  { name: 'IMJ Ignitors', shortCode: 'IGN', sportType: 'cricket' },
  { name: 'IMJ Falcons', shortCode: 'FAL', sportType: 'cricket' },
  { name: 'IMJ Hawks', shortCode: 'HAW', sportType: 'cricket' },
  { name: 'IMJ Phantoms', shortCode: 'PHA', sportType: 'cricket' },
  { name: 'IMJ Titans', shortCode: 'TIT', sportType: 'cricket' },
  { name: 'IMJ Ninjas', shortCode: 'NIN', sportType: 'cricket' },
];

async function seedTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/league_management');
    console.log('Connected to MongoDB');

    for (const teamData of teamsToAdd) {
      const existingTeam = await Team.findOne({
        $or: [{ name: teamData.name }, { shortCode: teamData.shortCode }]
      });

      if (existingTeam) {
        console.log(`Team ${teamData.name} already exists, skipping...`);
        continue;
      }

      const team = new Team(teamData);
      await team.save();
      console.log(`Created team: ${teamData.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teams:', error);
    process.exit(1);
  }
}

seedTeams();
