import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSport } from '../context/SportContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  TrophyIcon, 
  UsersIcon, 
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { selectedSport, switchSport, SPORT_TYPES } = useSport();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSportSwitch = (sport) => {
    switchSport(sport);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Teams', href: '/teams', icon: UsersIcon },
    { name: 'Matches', href: '/matches', icon: CalendarIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
    { name: 'Dashboard', href: '/dashboard', icon: UserIcon },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', href: '/admin', icon: ShieldCheckIcon });
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/teams" className="flex items-center space-x-2">
              <TrophyIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">LeagueHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Sport Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleSportSwitch(SPORT_TYPES.CRICKET)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSport === SPORT_TYPES.CRICKET
                    ? 'bg-cricket-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                🏏 Cricket
              </button>
              <button
                onClick={() => handleSportSwitch(SPORT_TYPES.THROWBALL)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSport === SPORT_TYPES.THROWBALL
                    ? 'bg-throwball-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                🤾 Throwball
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user?.username}
                    {isAdmin && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Sport Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => handleSportSwitch(SPORT_TYPES.CRICKET)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedSport === SPORT_TYPES.CRICKET
                      ? 'bg-cricket-500 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  🏏 Cricket
                </button>
                <button
                  onClick={() => handleSportSwitch(SPORT_TYPES.THROWBALL)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedSport === SPORT_TYPES.THROWBALL
                      ? 'bg-throwball-500 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  🤾 Throwball
                </button>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActivePath(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-900">
                      {user?.username}
                      {isAdmin && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
