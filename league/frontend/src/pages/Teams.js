import React, { useState, useEffect, useCallback } from "react";
import { useSport } from "../context/SportContext";
import { useAuth } from "../context/AuthContext";
import { teamService } from "../services/teamService";
import toast from "react-hot-toast";
import {
  PlusIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import TeamModal from "../components/TeamModal";
import PlayerModal from "../components/PlayerModal";
import TeamLogo from "../components/TeamLogo";

const Teams = () => {
  const { selectedSport, getSportIcon, getSportColor } = useSport();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teamService.getTeamsBySport(selectedSport);
      setTeams(response.data.data?.teams || []);
    } catch (error) {
      toast.error("Failed to fetch teams");
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    fetchTeams();
  }, [selectedSport, fetchTeams]);

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
        toast.success("Team deleted successfully");
        fetchTeams();
      } catch (error) {
        toast.error("Failed to delete team");
      }
    }
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
  };

  const handleAddPlayer = (team) => {
    setSelectedTeam(team);
    setShowPlayerModal(true);
  };

  const handleTeamModalClose = (teamUpdated) => {
    setShowTeamModal(false);
    setEditingTeam(null);
    if (teamUpdated) {
      fetchTeams();
    }
  };

  const handlePlayerModalClose = (playerAdded) => {
    setShowPlayerModal(false);
    setSelectedTeam(null);
    if (playerAdded) {
      fetchTeams();
    }
  };

  const sportColorClass = getSportColor(selectedSport);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
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
            <span className="text-4xl">{getSportIcon(selectedSport)}</span>
            <span>Teams</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Manage {selectedSport === "cricket" ? "Cricket" : "Throwball"} teams
            and players
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreateTeam}
            className="btn btn-primary mt-4 sm:mt-0"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Team
          </button>
        )}
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No teams found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new team
          </p>
          {isAdmin && (
            <div className="mt-6">
              <button onClick={handleCreateTeam} className="btn btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Team
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                {/* Team Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TeamLogo teamName={team.name} size="md" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {team.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewTeam(team)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit Team"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete Team"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {team.stats.matchesPlayed}
                    </div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {team.stats.points}
                    </div>
                    <div className="text-xs text-gray-500">Points</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Players:</span>
                    <span className="font-medium">
                      {team.players?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Win Rate:</span>
                    <span className="font-medium">
                      {team.stats.matchesPlayed > 0
                        ? `${((team.stats.matchesWon / team.stats.matchesPlayed) * 100).toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  {selectedSport === "cricket" && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">NRR:</span>
                      <span className="font-medium">
                        {team.stats.netRunRate.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewTeam(team)}
                      className="flex-1 btn btn-secondary text-sm"
                    >
                      View Details
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleAddPlayer(team)}
                        className="flex-1 btn btn-primary text-sm"
                      >
                        Add Player
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showTeamModal && (
        <TeamModal
          team={editingTeam}
          sportType={selectedSport}
          onClose={handleTeamModalClose}
        />
      )}

      {showPlayerModal && selectedTeam && (
        <PlayerModal team={selectedTeam} onClose={handlePlayerModalClose} />
      )}
    </div>
  );
};

export default Teams;
