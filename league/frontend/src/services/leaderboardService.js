import api from './authService';

export const leaderboardService = {
  // Get leaderboard by sport type
  getLeaderboard: (sportType, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('sportType', sportType);
    params.append('page', page);
    params.append('limit', limit);
    
    return api.get(`/leaderboard?${params.toString()}`);
  },

  // Get team statistics
  getTeamStats: (teamId) => api.get(`/leaderboard/team/${teamId}`),

  // Get top performers by category
  getTopPerformers: (sportType, category = 'points', limit = 5) => {
    const params = new URLSearchParams();
    params.append('sportType', sportType);
    params.append('category', category);
    params.append('limit', limit);
    
    return api.get(`/leaderboard/top-performers?${params.toString()}`);
  },

  // Get points table
  getPointsTable: (sportType) => {
    return api.get(`/leaderboard?sportType=${sportType}&limit=50`);
  },

  // Get top run scorers (cricket)
  getTopRunScorers: (sportType, limit = 10) => {
    return api.get(`/leaderboard/top-performers?sportType=${sportType}&category=runs&limit=${limit}`);
  },

  // Get teams with highest win rate
  getTopWinRate: (sportType, limit = 10) => {
    return api.get(`/leaderboard/top-performers?sportType=${sportType}&category=wins&limit=${limit}`);
  },

  // Get teams with best NRR (cricket)
  getBestNRR: (limit = 10) => {
    return api.get(`/leaderboard/top-performers?sportType=cricket&category=nrr&limit=${limit}`);
  },
};
