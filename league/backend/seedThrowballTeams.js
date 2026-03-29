const mongoose = require('mongoose');
const Team = require('./models/Team');
require('dotenv').config();

const throwballTeams = [
  { name: 'IMJ Ignitors', shortCode: 'IGN', sportType: 'throwball' },
  { name: 'IMJ Falcons', shortCode: 'FAL', sportType: 'throwball' },
  { name: 'IMJ Hawks', shortCode: 'HAW', sportType: 'throwball' },
  { name: 'IMJ Phantoms', shortCode: 'PHA', sportType: 'throwball' },
  { name: 'IMJ Titans', shortCode: 'TIT', sportType: 'throwball' },
  { name: 'IMJ Ninjas', shortCode: 'NIN', sportType: 'throwball' },
];

async function seedThrowballTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/league_management');
    console.log('Connected to MongoDB');

    for (const teamData of throwballTeams) {
      // Check for existing team with same name AND sport type
      const existingTeam = await Team.findOne({
        name: teamData.name,
        sportType: teamData.sportType
      });

      if (existingTeam) {
        console.log(`Throwball team ${teamData.name} already exists, skipping...`);
        continue;
      }

      // Check if shortCode is taken by another throwball team
      const existingShortCode = await Team.findOne({
        shortCode: teamData.shortCode,
        sportType: teamData.sportType
      });

      if (existingShortCode) {
        console.log(`Short code ${teamData.shortCode} already exists for throwball, skipping...`);
        continue;
      }

      const team = new Team(teamData);
      await team.save();
      console.log(`Created throwball team: ${teamData.name}`);
    }

    console.log('Throwball teams seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding throwball teams:', error);
    process.exit(1);
  }
}

seedThrowballTeams();
