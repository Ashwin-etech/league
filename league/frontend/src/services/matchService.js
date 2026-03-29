import api from './authService';

export const matchService = {
  // Get all matches with optional filters
  getMatches: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/matches?${queryParams.toString()}`);
  },

  // Get upcoming matches
  getUpcomingMatches: (sportType) => {
    const params = new URLSearchParams();
    params.append('upcoming', 'true');
    if (sportType) params.append('sportType', sportType);
    
    return api.get(`/matches/upcoming?${params.toString()}`);
  },

  // Get match by ID
  getMatchById: (id) => api.get(`/matches/${id}`),

  // Create new match (admin only)
  createMatch: (matchData) => api.post('/matches', matchData),

  // Update match (admin only)
  updateMatch: (id, matchData) => api.put(`/matches/${id}`, matchData),

  // Update match result (admin only)
  updateMatchResult: (id, resultData) => api.patch(`/matches/${id}/result`, resultData),

  // Delete match (admin only)
  deleteMatch: (id) => api.delete(`/matches/${id}`),

  // Get matches by sport type
  getMatchesBySport: (sportType, status) => {
    const params = new URLSearchParams();
    if (sportType) params.append('sportType', sportType);
    if (status) params.append('status', status);
    
    return api.get(`/matches?${params.toString()}`);
  },

  // Get completed matches
  getCompletedMatches: (sportType) => {
    const params = new URLSearchParams();
    params.append('status', 'completed');
    if (sportType) params.append('sportType', sportType);
    
    return api.get(`/matches?${params.toString()}`);
  },

  // Get live matches
  getLiveMatches: (sportType) => {
    const params = new URLSearchParams();
    params.append('status', 'live');
    if (sportType) params.append('sportType', sportType);
    
    return api.get(`/matches?${params.toString()}`);
  },
};
