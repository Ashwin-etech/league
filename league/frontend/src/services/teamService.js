import api from './authService';

export const teamService = {
  // Get all teams with optional filters
  getTeams: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/teams?${queryParams.toString()}`);
  },

  // Get team by ID
  getTeamById: (id) => api.get(`/teams/${id}`),

  // Create new team (admin only)
  createTeam: (teamData) => api.post('/teams', teamData),

  // Update team (admin only)
  updateTeam: (id, teamData) => api.put(`/teams/${id}`, teamData),

  // Delete team (admin only)
  deleteTeam: (id) => api.delete(`/teams/${id}`),

  // Add player to team (admin only)
  addPlayer: (teamId, playerData) => api.post(`/teams/${teamId}/players`, playerData),

  // Get teams by sport type
  getTeamsBySport: (sportType) => api.get(`/teams?sportType=${sportType}`),

  // Search teams
  searchTeams: (query, sportType) => {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (sportType) params.append('sportType', sportType);
    
    return api.get(`/teams?${params.toString()}`);
  },
};
