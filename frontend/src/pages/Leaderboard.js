import React, { useState, useEffect } from "react";
import { useSport } from "../context/SportContext";
import { leaderboardService } from "../services/leaderboardService";
import toast from "react-hot-toast";
import {
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  MedalIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import TeamLogo from "../components/TeamLogo";

const DEFAULT_TEAMS = [
  "IMJ Ignitors",
  "IMJ Falcons",
  "IMJ Hawks",
  "IMJ Phantoms",
  "IMJ Titans",
  "IMJ Ninjas",
];

const newTeamStats = (teamName) => ({
  _id: teamName.replace(/\s+/g, "-").toLowerCase(),
  name: teamName,
  position: 0,
  stats: {
    matchesPlayed: 0,
    matchesWon: 0,
    matchesLost: 0,
    matchesTied: 0,
    points: 0,
    netRunRate: 0,
  },
  winPercentage: 0,
  form: [],
});

const ensureSixTeams = (rows) => {
  const map = new Map();
  rows.forEach((row) => {
    const normalizedName = row.name?.trim();
    if (!normalizedName) return;
    map.set(normalizedName, {
      ...newTeamStats(normalizedName),
      ...row,
      stats: {
        ...newTeamStats(normalizedName).stats,
        ...(row.stats || {}),
      },
      winPercentage:
        typeof row.winPercentage === "number" ? row.winPercentage : 0,
      form: Array.isArray(row.form) ? row.form : [],
    });
  });

  DEFAULT_TEAMS.forEach((teamName) => {
    if (!map.has(teamName)) {
      map.set(teamName, newTeamStats(teamName));
    }
  });

  const sorted = Array.from(map.values()).sort((a, b) => {
    const aPts = a.stats?.points || 0;
    const bPts = b.stats?.points || 0;
    if (bPts !== aPts) return bPts - aPts;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((team, index) => ({
    ...team,
    position: index + 1,
  }));
};

const Leaderboard = () => {
  const { selectedSport, getSportIcon, getSportColor } = useSport();
  const [leaderboard, setLeaderboard] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("points");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
    fetchTopPerformers();
  }, [selectedSport, currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardService.getLeaderboard(
        selectedSport,
        currentPage,
      );
      const rows = response.data.leaderboard || [];
      const fullLeaderboard = ensureSixTeams(rows);
      setLeaderboard(fullLeaderboard);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      toast.error("Failed to fetch leaderboard");
      console.error("Error fetching leaderboard:", error);
      setLeaderboard(ensureSixTeams([]));
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      const response = await leaderboardService.getTopPerformers(
        selectedSport,
        selectedCategory,
        5,
      );
      setTopPerformers(response.data.topPerformers || []);
    } catch (error) {
      console.error("Error fetching top performers:", error);
    }
  };

  useEffect(() => {
    fetchTopPerformers();
  }, [selectedCategory]);

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <StarIconSolid className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <StarIconSolid className="h-5 w-5 text-gray-400" />;
      case 3:
        return <StarIconSolid className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-gray-600 font-medium">{position}</span>;
    }
  };

  const getFormBadge = (form) => {
    if (!form || form.length === 0) return null;

    return (
      <div className="flex space-x-1">
        {form.slice(0, 5).map((result, index) => (
          <span
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              result === "W"
                ? "bg-green-100 text-green-800"
                : result === "L"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {result}
          </span>
        ))}
      </div>
    );
  };

  const getCategoryLabel = (category) => {
    const labels = {
      points: "Most Points",
      wins: "Most Wins",
      nrr: "Best NRR",
      runs: "Most Runs",
    };
    return labels[category] || "Most Points";
  };

  const sportColorClass = getSportColor(selectedSport);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
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
            <span>Leaderboard</span>
          </h1>
          <p className="mt-2 text-gray-600">
            {selectedSport === "cricket" ? "Cricket" : "Throwball"} standings
            and rankings
          </p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Points Table
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getSportIcon(selectedSport)}
                  </span>
                  <span className="capitalize font-medium text-gray-600">
                    {selectedSport}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left">Pos</th>
                      <th className="text-left">Team</th>
                      <th className="text-center">P</th>
                      <th className="text-center">W</th>
                      <th className="text-center">L</th>
                      <th className="text-center">T</th>
                      <th className="text-center">Pts</th>
                      {selectedSport === "cricket" && (
                        <th className="text-center">NRR</th>
                      )}
                      <th className="text-center">Win %</th>
                      <th className="text-center">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((team) => (
                      <tr
                        key={team._id}
                        className={team.position <= 3 ? "bg-gray-50" : ""}
                      >
                        <td className="font-medium">
                          <div className="flex items-center space-x-2">
                            {getPositionIcon(team.position)}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <TeamLogo teamName={team.name} size="sm" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {team.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          {team.stats.matchesPlayed}
                        </td>
                        <td className="text-center font-medium text-green-600">
                          {team.stats.matchesWon}
                        </td>
                        <td className="text-center text-red-600">
                          {team.stats.matchesLost}
                        </td>
                        <td className="text-center text-gray-600">
                          {team.stats.matchesTied}
                        </td>
                        <td className="text-center font-bold text-lg">
                          {team.stats.points}
                        </td>
                        {selectedSport === "cricket" && (
                          <td className="text-center font-medium">
                            {team.stats.netRunRate.toFixed(3)}
                          </td>
                        )}
                        <td className="text-center">{team.winPercentage}%</td>
                        <td className="text-center">
                          {getFormBadge(team.form)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="btn btn-secondary text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Category Selector */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performers
              </h3>
            </div>
            <div className="card-body">
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "points",
                  "wins",
                  selectedSport === "cricket" ? "nrr" : null,
                  selectedSport === "cricket" ? "runs" : null,
                ]
                  .filter(Boolean)
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? `bg-${sportColorClass}-500 text-white`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
              </div>

              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div
                    key={performer._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <TeamLogo teamName={performer.name} size="sm" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {performer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Rank #{performer.rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {performer.categoryValue}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedCategory === "points" && "Points"}
                        {selectedCategory === "wins" && "Wins"}
                        {selectedCategory === "nrr" && "NRR"}
                        {selectedCategory === "runs" && "Runs"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Statistics
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Total Teams</span>
                </div>
                <span className="font-bold">{leaderboard.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-600">Matches Played</span>
                </div>
                <span className="font-bold">
                  {leaderboard.reduce(
                    (sum, team) => sum + team.stats.matchesPlayed,
                    0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Total Points</span>
                </div>
                <span className="font-bold">
                  {leaderboard.reduce(
                    (sum, team) => sum + team.stats.points,
                    0,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
