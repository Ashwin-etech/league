import React from 'react';
import { Link } from 'react-router-dom';
import { useSport } from '../context/SportContext';
import { 
  TrophyIcon, 
  UsersIcon, 
  CalendarIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const { selectedSport, getCurrentSportConfig, getSportIcon } = useSport();
  const sportConfig = getCurrentSportConfig();

  const features = [
    {
      name: 'Team Management',
      description: 'Create and manage teams with player details, rosters, and statistics.',
      icon: UsersIcon,
      href: '/teams',
      color: 'blue'
    },
    {
      name: 'Match Scheduling',
      description: 'Schedule fixtures, manage venues, and track match progress.',
      icon: CalendarIcon,
      href: '/matches',
      color: 'green'
    },
    {
      name: 'Live Scores',
      description: 'Real-time match updates and detailed score tracking.',
      icon: PlayIcon,
      href: '/matches',
      color: 'purple'
    },
    {
      name: 'Leaderboards',
      description: 'Dynamic rankings, points tables, and performance analytics.',
      icon: ChartBarIcon,
      href: '/leaderboard',
      color: 'yellow'
    }
  ];

  const stats = [
    { name: 'Active Teams', value: '12+', change: '+2 from last month' },
    { name: 'Matches Played', value: '48+', change: '+8 this week' },
    { name: 'Players', value: '180+', change: '+15 new players' },
    { name: 'Tournaments', value: '2', change: 'Both active' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">{getSportIcon(selectedSport)}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {sportConfig.name} League Management
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              {sportConfig.description} - Complete tournament management with real-time scoring, 
              team statistics, and comprehensive analytics.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/teams"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 text-lg font-medium inline-flex items-center justify-center"
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                View Teams
              </Link>
              <Link
                to="/matches"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 text-lg font-medium inline-flex items-center justify-center"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Upcoming Matches
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for League Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to manage your {sportConfig.name.toLowerCase()} league efficiently 
            with professional-grade features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="group card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="card-body text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}-100 mb-4 group-hover:bg-${feature.color}-200 transition-colors`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center justify-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/teams"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <UsersIcon className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-gray-900">Browse Teams</span>
          </Link>
          <Link
            to="/matches"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <CalendarIcon className="h-6 w-6 text-green-600" />
            <span className="font-medium text-gray-900">View Fixtures</span>
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            <span className="font-medium text-gray-900">Standings</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <TrophyIcon className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-gray-900">Admin Panel</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
