import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { matchService } from "../services/matchService";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MatchModal = ({ match, sportType, teams, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!match;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: match || {
      team1: "",
      team2: "",
      sportType: sportType,
      venue: "",
      scheduledDate: "",
      scheduledTime: "",
      matchType: "league",
    },
  });

  const selectedTeam1 = watch("team1");
  const selectedTeam2 = watch("team2");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await matchService.updateMatch(match._id, data);
        toast.success("Match updated successfully");
      } else {
        await matchService.createMatch(data);
        toast.success("Match scheduled successfully");
      }
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save match");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose(false);
  };

  const getTeamOptions = () => {
    return teams.filter(
      (team) =>
        team.sportType === sportType &&
        team._id !== selectedTeam1 &&
        team._id !== selectedTeam2,
    );
  };

  const team1Options = teams.filter(
    (team) => team.sportType === sportType && team._id !== selectedTeam2,
  );

  const team2Options = teams.filter(
    (team) => team.sportType === sportType && team._id !== selectedTeam1,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Match" : "Schedule New Match"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="team1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team 1 *
                </label>
                <select
                  {...register("team1", {
                    required: "Team 1 is required",
                  })}
                  className={`input mt-1 ${errors.team1 ? "input-error" : ""}`}
                >
                  <option value="">Select Team 1</option>
                  {team1Options.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.team1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.team1.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="team2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team 2 *
                </label>
                <select
                  {...register("team2", {
                    required: "Team 2 is required",
                  })}
                  className={`input mt-1 ${errors.team2 ? "input-error" : ""}`}
                >
                  <option value="">Select Team 2</option>
                  {team2Options.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.team2 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.team2.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700"
              >
                Venue *
              </label>
              <input
                {...register("venue", {
                  required: "Venue is required",
                  minLength: {
                    value: 2,
                    message: "Venue must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Venue cannot exceed 100 characters",
                  },
                })}
                type="text"
                className={`input mt-1 ${errors.venue ? "input-error" : ""}`}
                placeholder="Enter venue name"
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.venue.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date *
                </label>
                <input
                  {...register("scheduledDate", {
                    required: "Date is required",
                  })}
                  type="date"
                  className={`input mt-1 ${errors.scheduledDate ? "input-error" : ""}`}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheduledDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="scheduledTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time *
                </label>
                <input
                  {...register("scheduledTime", {
                    required: "Time is required",
                    pattern: {
                      value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      message: "Time must be in HH:MM format",
                    },
                  })}
                  type="time"
                  className={`input mt-1 ${errors.scheduledTime ? "input-error" : ""}`}
                />
                {errors.scheduledTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheduledTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="matchType"
                className="block text-sm font-medium text-gray-700"
              >
                Match Type
              </label>
              <select
                {...register("matchType")}
                className={`input mt-1 ${errors.matchType ? "input-error" : ""}`}
              >
                <option value="league">League Match</option>
                <option value="knockout">Knockout Match</option>
                <option value="final">Final</option>
              </select>
              {errors.matchType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.matchType.message}
                </p>
              )}
            </div>

            <div className="hidden">
              <input
                {...register("sportType")}
                type="hidden"
                value={sportType}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Make sure both teams are available and the venue is
                    confirmed before scheduling.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditing ? "Updating..." : "Scheduling..."}
                  </div>
                ) : isEditing ? (
                  "Update Match"
                ) : (
                  "Schedule Match"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
