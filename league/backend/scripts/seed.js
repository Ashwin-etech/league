const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Team = require('../models/Team');
const Match = require('../models/Match');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@league.com',
    password: 'Admin123',
    role: 'admin'
  },
  {
    username: 'user1',
    email: 'user1@league.com',
    password: 'User123',
    role: 'user'
  }
];

const sampleTeams = {
  cricket: [
    {
      name: 'Mumbai Indians',
      shortCode: 'MI',
      sportType: 'cricket',
      homeGround: 'Wankhede Stadium, Mumbai',
      foundedYear: 2008,
      players: [
        { name: 'Rohit Sharma', jerseyNumber: 45, role: 'batsman' },
        { name: 'Jasprit Bumrah', jerseyNumber: 93, role: 'bowler' },
        { name: 'Hardik Pandya', jerseyNumber: 33, role: 'all-rounder' }
      ]
    },
    {
      name: 'Chennai Super Kings',
      shortCode: 'CSK',
      sportType: 'cricket',
      homeGround: 'M.A. Chidambaram Stadium, Chennai',
      foundedYear: 2008,
      players: [
        { name: 'MS Dhoni', jerseyNumber: 7, role: 'wicket-keeper' },
        { name: 'Ravindra Jadeja', jerseyNumber: 8, role: 'all-rounder' },
        { name: 'Deepak Chahar', jerseyNumber: 11, role: 'bowler' }
      ]
    },
    {
      name: 'Royal Challengers Bangalore',
      shortCode: 'RCB',
      sportType: 'cricket',
      homeGround: 'M. Chinnaswamy Stadium, Bangalore',
      foundedYear: 2008,
      players: [
        { name: 'Virat Kohli', jerseyNumber: 18, role: 'batsman' },
        { name: 'Faf du Plessis', jerseyNumber: 13, role: 'batsman' },
        { name: 'Mohammed Siraj', jerseyNumber: 22, role: 'bowler' }
      ]
    }
  ],
  throwball: [
    {
      name: 'Thunderbolts',
      shortCode: 'TB',
      sportType: 'throwball',
      homeGround: 'Sports Complex, Delhi',
      foundedYear: 2019,
      players: [
        { name: 'Priya Sharma', jerseyNumber: 7, role: 'player' },
        { name: 'Anita Patel', jerseyNumber: 12, role: 'player' },
        { name: 'Kavita Reddy', jerseyNumber: 15, role: 'player' }
      ]
    },
    {
      name: 'Lightning Strikes',
      shortCode: 'LS',
      sportType: 'throwball',
      homeGround: 'Indoor Stadium, Mumbai',
      foundedYear: 2020,
      players: [
        { name: 'Sonia Gupta', jerseyNumber: 3, role: 'player' },
        { name: 'Meera Joshi', jerseyNumber: 9, role: 'player' },
        { name: 'Nisha Singh', jerseyNumber: 18, role: 'player' }
      ]
    }
  ]
};

const sampleMatches = {
  cricket: [
    {
      team1: null, // Will be populated after team creation
      team2: null, // Will be populated after team creation
      sportType: 'cricket',
      venue: 'Wankhede Stadium, Mumbai',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      scheduledTime: '19:30',
      matchType: 'league',
      status: 'scheduled'
    },
    {
      team1: null, // Will be populated after team creation
      team2: null, // Will be populated after team creation
      sportType: 'cricket',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      scheduledTime: '15:30',
      matchType: 'league',
      status: 'scheduled'
    }
  ],
  throwball: [
    {
      team1: null, // Will be populated after team creation
      team2: null, // Will be populated after team creation
      sportType: 'throwball',
      venue: 'Sports Complex, Delhi',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      scheduledTime: '10:00',
      matchType: 'league',
      status: 'scheduled'
    }
  ]
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/league_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Match.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create teams
    const createdTeams = {};
    for (const [sportType, teams] of Object.entries(sampleTeams)) {
      createdTeams[sportType] = [];
      for (const teamData of teams) {
        const team = new Team(teamData);
        await team.save();
        createdTeams[sportType].push(team);
      }
      console.log(`Created ${teams.length} ${sportType} teams`);
    }

    // Create matches
    const createdMatches = [];
    for (const [sportType, matches] of Object.entries(sampleMatches)) {
      const teams = createdTeams[sportType];
      if (teams.length >= 2) {
        for (let i = 0; i < matches.length; i++) {
          const matchData = { ...matches[i] };
          matchData.team1 = teams[i % teams.length]._id;
          matchData.team2 = teams[(i + 1) % teams.length]._id;
          
          const match = new Match(matchData);
          await match.save();
          createdMatches.push(match);
        }
        console.log(`Created ${matches.length} ${sportType} matches`);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\n=== Sample Login Credentials ===');
    console.log('Admin: admin@league.com / Admin123');
    console.log('User: user1@league.com / User123');
    console.log('\n=== Created Teams ===');
    console.log('Cricket: MI, CSK, RCB');
    console.log('Throwball: TB, LS');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedDatabase();
