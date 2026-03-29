import React, { useState, useEffect } from "react";
import { useSport } from "../context/SportContext";
import { useAuth } from "../context/AuthContext";
import { matchService } from "../services/matchService";
import { teamService } from "../services/teamService";
import { leaderboardService } from "../services/leaderboardService";
import toast from "react-hot-toast";
import {
  TrophyIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  PlayIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import TeamLogo from "../components/TeamLogo";
import { format } from "date-fns";

const Dashboard = () => {
  const {
    selectedSport,
    getSportIcon,
    getSportColor,
    switchSport,
    SPORT_TYPES,
  } = useSport();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [selectedSport]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        upcomingResponse,
        recentResponse,
        teamsResponse,
        leaderboardResponse,
      ] = await Promise.all([
        matchService.getUpcomingMatches(selectedSport),
        matchService.getCompletedMatches(selectedSport),
        teamService.getTeamsBySport(selectedSport),
        leaderboardService.getLeaderboard(selectedSport, 1, 5),
      ]);

      setUpcomingMatches(upcomingResponse.data.matches || []);
      setRecentMatches(recentResponse.data.matches?.slice(0, 5) || []);
      setTopTeams(leaderboardResponse.data.leaderboard || []);

      // Calculate stats
      const teams = teamsResponse.data.data?.teams || [];
      const totalMatches = teams.reduce(
        (sum, team) => sum + team.stats.matchesPlayed,
        0,
      );
      const totalPoints = teams.reduce(
        (sum, team) => sum + team.stats.points,
        0,
      );

      setStats({
        totalTeams: teams.length,
        totalMatches,
        totalPoints,
        activePlayers: teams.reduce(
          (sum, team) => sum + (team.players?.length || 0),
          0,
        ),
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const sportColorClass = getSportColor(selectedSport);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Access Denied
        </h3>
        <p className="mt-1 text-sm text-gray-500">Admin access required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your {selectedSport === "cricket" ? "Cricket" : "Throwball"}{" "}
            league
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchSport(SPORT_TYPES.CRICKET)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSport === SPORT_TYPES.CRICKET
                  ? "bg-cricket-500 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              🏏 Cricket
            </button>
            <button
              onClick={() => switchSport(SPORT_TYPES.THROWBALL)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSport === SPORT_TYPES.THROWBALL
                  ? "bg-throwball-500 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              🤾 Throwball
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTeams}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Matches
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMatches}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPoints}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Players
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activePlayers}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <PlusIcon className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Add Team</div>
                <div className="text-sm text-gray-500">Create new team</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <CalendarIcon className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Schedule Match</div>
                <div className="text-sm text-gray-500">Create fixture</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Update Result</div>
                <div className="text-sm text-gray-500">Match scores</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">View Reports</div>
                <div className="text-sm text-gray-500">Analytics</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Matches
              </h3>
              <span className="text-2xl">{getSportIcon(selectedSport)}</span>
            </div>
          </div>
          <div className="card-body">
            {upcomingMatches.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">
                  No upcoming matches
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.slice(0, 5).map((match) => (
                  <div
                    key={match._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(match.status)}
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          <TeamLogo teamName={match.team1?.name} size="sm" />
                          <span>vs</span>
                          <TeamLogo teamName={match.team2?.name} size="sm" />
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.venue}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(match.scheduledDate), "MMM dd")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {match.scheduledTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Teams */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Teams</h3>
              <TrophyIcon className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="card-body">
            {topTeams.length === 0 ? (
              <div className="text-center py-8">
                <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">No teams available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topTeams.map((team, index) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <TeamLogo teamName={team.name} size="sm" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {team.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Position: {team.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {team.stats.points}
                      </div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="card-body">
          {recentMatches.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div
                  key={match._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        <TeamLogo teamName={match.winner?.name} size="xs" />{" "}
                        {match.winner?.name} defeated{" "}
                        {match.winner?._id === match.team1?._id
                          ? match.team2?.name
                          : match.team1?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {match.scores?.team1?.teamRuns ||
                          match.scores?.team1?.teamPoints}{" "}
                        -{" "}
                        {match.scores?.team2?.teamRuns ||
                          match.scores?.team2?.teamPoints}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(match.scheduledDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-gray-500">{match.venue}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
