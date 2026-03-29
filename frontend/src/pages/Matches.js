import React, { useState, useEffect } from "react";
import { useSport } from "../context/SportContext";
import { useAuth } from "../context/AuthContext";
import { matchService } from "../services/matchService";
import { teamService } from "../services/teamService";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import MatchModal from "../components/MatchModal";
import ResultModal from "../components/ResultModal";
import TeamLogo from "../components/TeamLogo";
import { format } from "date-fns";

// Cricket League Fixtures Data
const CRICKET_FIXTURES = [
  {
    round: 1,
    matches: [
      { team1: "IMJ Ignitors", team2: "IMJ Falcons" },
      { team1: "IMJ Hawks", team2: "IMJ Phantoms" },
      { team1: "IMJ Titans", team2: "IMJ Ninjas" },
    ],
  },
  {
    round: 2,
    matches: [
      { team1: "IMJ Ignitors", team2: "IMJ Hawks" },
      { team1: "IMJ Falcons", team2: "IMJ Titans" },
      { team1: "IMJ Phantoms", team2: "IMJ Ninjas" },
    ],
  },
  {
    round: 3,
    matches: [
      { team1: "IMJ Ignitors", team2: "IMJ Phantoms" },
      { team1: "IMJ Hawks", team2: "IMJ Titans" },
      { team1: "IMJ Falcons", team2: "IMJ Ninjas" },
    ],
  },
  {
    round: 4,
    matches: [
      { team1: "IMJ Ignitors", team2: "IMJ Titans" },
      { team1: "IMJ Phantoms", team2: "IMJ Falcons" },
      { team1: "IMJ Hawks", team2: "IMJ Ninjas" },
    ],
  },
  {
    round: 5,
    matches: [
      { team1: "IMJ Ignitors", team2: "IMJ Ninjas" },
      { team1: "IMJ Titans", team2: "IMJ Phantoms" },
      { team1: "IMJ Falcons", team2: "IMJ Hawks" },
    ],
  },
];

// Throwball League Fixtures Data
const THROWBALL_FIXTURES = [
  {
    round: 1,
    matches: [
      { team1: "IMJ Ninjas", team2: "IMJ Titans" },
      { team1: "IMJ Phantoms", team2: "IMJ Hawks" },
      { team1: "IMJ Falcons", team2: "IMJ Ignitors" },
    ],
  },
  {
    round: 2,
    matches: [
      { team1: "IMJ Ninjas", team2: "IMJ Phantoms" },
      { team1: "IMJ Titans", team2: "IMJ Falcons" },
      { team1: "IMJ Hawks", team2: "IMJ Ignitors" },
    ],
  },
  {
    round: 3,
    matches: [
      { team1: "IMJ Ninjas", team2: "IMJ Hawks" },
      { team1: "IMJ Phantoms", team2: "IMJ Falcons" },
      { team1: "IMJ Titans", team2: "IMJ Ignitors" },
    ],
  },
  {
    round: 4,
    matches: [
      { team1: "IMJ Ninjas", team2: "IMJ Falcons" },
      { team1: "IMJ Hawks", team2: "IMJ Titans" },
      { team1: "IMJ Phantoms", team2: "IMJ Ignitors" },
    ],
  },
  {
    round: 5,
    matches: [
      { team1: "IMJ Ninjas", team2: "IMJ Ignitors" },
      { team1: "IMJ Falcons", team2: "IMJ Hawks" },
      { team1: "IMJ Titans", team2: "IMJ Phantoms" },
    ],
  },
];

const TEAM_COLORS = {
  "IMJ Ignitors": "bg-orange-100 text-orange-600",
  "IMJ Falcons": "bg-blue-100 text-blue-600",
  "IMJ Hawks": "bg-red-100 text-red-600",
  "IMJ Phantoms": "bg-purple-100 text-purple-600",
  "IMJ Titans": "bg-green-100 text-green-600",
  "IMJ Ninjas": "bg-gray-100 text-gray-600",
};

// Get fixtures based on sport type
const getFixtures = (sportType) =>
  sportType === "cricket" ? CRICKET_FIXTURES : THROWBALL_FIXTURES;

const Matches = () => {
  const { selectedSport, getSportIcon } = useSport();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [viewMode, setViewMode] = useState("rounds");

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, [selectedSport, filterStatus]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = { sportType: selectedSport };
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      const response = await matchService.getMatches(params);
      setMatches(response.data.matches || []);
    } catch (error) {
      toast.error("Failed to fetch matches");
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamService.getTeamsBySport(selectedSport);
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
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
    if (window.confirm(`Are you sure you want to delete this match?`)) {
      try {
        await matchService.deleteMatch(match._id);
        toast.success("Match deleted successfully");
        fetchMatches();
      } catch (error) {
        toast.error("Failed to delete match");
      }
    }
  };

  const handleUpdateResult = (match) => {
    setSelectedMatch(match);
    setShowResultModal(true);
  };

  const handleMatchModalClose = (matchUpdated) => {
    setShowMatchModal(false);
    setEditingMatch(null);
    if (matchUpdated) {
      fetchMatches();
    }
  };

  const handleResultModalClose = (resultUpdated) => {
    setShowResultModal(false);
    setSelectedMatch(null);
    if (resultUpdated) {
      fetchMatches();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      case "live":
        return <PlayIcon className="h-4 w-4 text-red-500 animate-pulse" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "postponed":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      scheduled: "badge-info",
      live: "badge-danger",
      completed: "badge-success",
      postponed: "badge-warning",
      cancelled: "badge-secondary",
    };
    return colors[status] || "badge-secondary";
  };

  // Get match winner name
  const getMatchWinner = (match) => {
    if (!match || match.status !== "completed") return null;
    return match.winner?.name;
  };

  // Find match from API that corresponds to a fixture
  const findMatch = (team1Name, team2Name) => {
    return matches.find(
      (m) =>
        (m.team1?.name === team1Name && m.team2?.name === team2Name) ||
        (m.team1?.name === team2Name && m.team2?.name === team1Name),
    );
  };

  // Render Fixtures View (Rounds)
  const renderFixturesView = () => {
    const fixtures = getFixtures(selectedSport);
    const isThrowball = selectedSport === "throwball";

    return (
      <div className="space-y-8">
        <div
          className={`rounded-xl p-6 text-white ${
            isThrowball
              ? "bg-gradient-to-r from-throwball-500 to-throwball-600"
              : "bg-gradient-to-r from-cricket-500 to-cricket-600"
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <TrophyIcon className="h-8 w-8" />
            <h2 className="text-2xl font-bold">
              {isThrowball ? "🤾 Throwball" : "🏏 Cricket"} League Fixtures
            </h2>
          </div>
          <p
            className={isThrowball ? "text-throwball-100" : "text-cricket-100"}
          >
            15 matches across 5 rounds • 6 teams competing
          </p>
        </div>

        {fixtures.map((round) => (
          <div key={round.round} className="card">
            <div className="card-header bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm mr-3">
                  R{round.round}
                </span>
                Round {round.round}
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {round.matches.map((fixture, idx) => {
                  const match = findMatch(fixture.team1, fixture.team2);
                  const status = match?.status || "scheduled";
                  const winner = getMatchWinner(match);
                  const isTeam1Winner = winner === fixture.team1;
                  const isTeam2Winner = winner === fixture.team2;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        isAdmin && match && handleUpdateResult(match)
                      }
                      className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${
                        isAdmin && match ? "cursor-pointer" : ""
                      }`}
                      title={isAdmin && match ? "Click to update result" : ""}
                    >
                      {/* Team 1 */}
                      <div
                        className={`flex items-center space-x-3 flex-1 ${
                          match?.status === "completed" && isTeam2Winner
                            ? "opacity-40"
                            : ""
                        }`}
                      >
                        <TeamLogo teamName={fixture.team1} size="md" />
                        <span className="font-medium text-gray-900 hidden sm:block">
                          {fixture.team1}
                        </span>
                      </div>

                      {/* VS / Score */}
                      <div className="text-center px-4">
                        {match?.status === "completed" ? (
                          <div className="text-xl font-bold text-gray-900">
                            {isThrowball
                              ? `${match.scores?.team1?.teamPoints || 0} - ${match.scores?.team2?.teamPoints || 0}`
                              : `${match.scores?.team1?.teamRuns || 0} - ${match.scores?.team2?.teamRuns || 0}`}
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-gray-400">
                            VS
                          </div>
                        )}
                        <div
                          className={`text-xs mt-1 ${
                            status === "completed"
                              ? "text-green-600"
                              : status === "live"
                                ? "text-red-600 animate-pulse"
                                : "text-blue-600"
                          }`}
                        >
                          {status === "completed"
                            ? winner
                              ? `${winner} Won`
                              : "Completed"
                            : status === "live"
                              ? "Live"
                              : match?.scheduledDate
                                ? format(
                                    new Date(match.scheduledDate),
                                    "MMM dd",
                                  )
                                : "TBD"}
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div
                        className={`flex items-center space-x-3 flex-1 justify-end ${
                          match?.status === "completed" && isTeam1Winner
                            ? "opacity-40"
                            : ""
                        }`}
                      >
                        <span className="font-medium text-gray-900 hidden sm:block text-right">
                          {fixture.team2}
                        </span>
                        <TeamLogo teamName={fixture.team2} size="md" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* League Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">League Summary</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.keys(TEAM_COLORS).map((teamName) => {
                const team = teams.find((t) => t.name === teamName);
                return (
                  <div
                    key={teamName}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <TeamLogo
                      teamName={teamName}
                      size="md"
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm font-medium text-gray-900">
                      {teamName}
                    </p>
                    {team && (
                      <p className="text-xs text-gray-500 mt-1">
                        {team.stats?.matchesWon || 0}W -{" "}
                        {team.stats?.matchesLost || 0}L
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matches...</p>
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
            <span>Matches</span>
          </h1>
          <p className="mt-2 text-gray-600">
            {selectedSport === "cricket"
              ? "🏏 Cricket League Fixtures - 15 matches across 5 rounds"
              : "🤾 Throwball League Fixtures - 15 matches across 5 rounds"}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("rounds")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "rounds"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Fixtures
            </button>
          </div>
        </div>
      </div>

      {/* Show Fixtures View for all sports */}
      {viewMode === "rounds" ? renderFixturesView() : null}

      {/* Modals */}
      {showMatchModal && (
        <MatchModal
          match={editingMatch}
          sportType={selectedSport}
          teams={teams}
          onClose={handleMatchModalClose}
        />
      )}

      {showResultModal && selectedMatch && (
        <ResultModal
          match={selectedMatch}
          sportType={selectedSport}
          onClose={handleResultModalClose}
        />
      )}
    </div>
  );
};

export default Matches;
