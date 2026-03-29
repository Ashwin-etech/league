import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSport } from '../context/SportContext';
import { teamService } from '../services/teamService';
import { matchService } from '../services/matchService';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  CalendarIcon,
  TrophyIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import TeamModal from '../components/TeamModal';
import MatchModal from '../components/MatchModal';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { selectedSport, getSportIcon } = useSport();
  const [activeTab, setActiveTab] = useState('overview');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedSport]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, matchesRes] = await Promise.all([
        teamService.getTeamsBySport(selectedSport),
        matchService.getMatchesBySport(selectedSport)
      ]);
      setTeams(teamsRes.data.data?.teams || []);
      setMatches(matchesRes.data.data?.matches || []);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  const handleDeleteTeam = async (team) => {
    if (window.confirm(`Are you sure you want to delete ${team.name}?`)) {
      try {
        await teamService.deleteTeam(team._id);
        toast.success('Team deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete team');
      }
    }
  };

  const handleCreateMatch = () => {
    setEditingMatch(null);
    setShowMatchModal(true);
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setShowMatchModal(true);
  };

  const handleDeleteMatch = async (match) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await matchService.deleteMatch(match._id);
        toast.success('Match deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete match');
      }
    }
  };

  const handleTeamModalClose = (updated) => {
    setShowTeamModal(false);
    setEditingTeam(null);
    if (updated) fetchData();
  };

  const handleMatchModalClose = (updated) => {
    setShowMatchModal(false);
    setEditingMatch(null);
    if (updated) fetchData();
  };

  const stats = {
    totalTeams: teams.length,
    totalMatches: matches.length,
    upcomingMatches: matches.filter(m => m.status === 'scheduled').length,
    completedMatches: matches.filter(m => m.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user?.username}. Manage your league here.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <span className="text-2xl">{getSportIcon(selectedSport)}</span>
          <span className="text-gray-600 capitalize">{selectedSport}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingMatches}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedMatches}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'teams'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matches'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Matches
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleCreateTeam}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Team</span>
                  </button>
                  <button
                    onClick={handleCreateMatch}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Schedule Match</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Teams */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Teams</h3>
                <button
                  onClick={() => setActiveTab('teams')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  View All
                </button>
              </div>
              <div className="card-body">
                {teams.slice(0, 5).map((team) => (
                  <div key={team._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="font-bold text-primary-600">{team.shortCode}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <p className="text-sm text-gray-500">{team.players?.length || 0} players</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Teams</h3>
              <button
                onClick={handleCreateTeam}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Team</span>
              </button>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.map((team) => (
                      <tr key={team._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                              <span className="font-bold text-primary-600">{team.shortCode}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">{team.sportType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {team.players?.length || 0} players
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {team.stats.points} pts | {team.stats.matchesWon}W-{team.stats.matchesLost}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditTeam(team)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Matches</h3>
              <button
                onClick={handleCreateMatch}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Schedule Match</span>
              </button>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {match.team1?.name} vs {match.team2?.name}
                          </div>
                          <div className="text-sm text-gray-500">{match.venue}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(match.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            match.status === 'completed' ? 'bg-green-100 text-green-800' :
                            match.status === 'live' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditMatch(match)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMatch(match)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTeamModal && (
        <TeamModal
          team={editingTeam}
          sportType={selectedSport}
          onClose={handleTeamModalClose}
        />
      )}

      {showMatchModal && (
        <MatchModal
          match={editingMatch}
          sportType={selectedSport}
          teams={teams}
          onClose={handleMatchModalClose}
        />
      )}
    </div>
  );
};

export default Admin;
