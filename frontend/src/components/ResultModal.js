import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { matchService } from "../services/matchService";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TeamLogo from "./TeamLogo";

const ResultModal = ({ match, sportType, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      sportType: sportType,
      scores: {
        team1:
          sportType === "cricket"
            ? {
                teamRuns: "",
                teamWickets: "",
                teamOvers: "",
              }
            : {
                teamPoints: "",
                setsWon: "",
              },
        team2:
          sportType === "cricket"
            ? {
                teamRuns: "",
                teamWickets: "",
                teamOvers: "",
              }
            : {
                teamPoints: "",
                setsWon: "",
              },
      },
    },
  });

  const team1Runs = watch("scores.team1.teamRuns");
  const team2Runs = watch("scores.team2.teamRuns");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await matchService.updateMatchResult(match._id, data);
      toast.success("Match result updated successfully");
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update result");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Update Match Result
              </h3>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <TeamLogo teamName={match.team1?.name} size="sm" />
                <span>vs</span>
                <TeamLogo teamName={match.team2?.name} size="sm" />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team 1 Score */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <TeamLogo teamName={match.team1?.name} size="md" />
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {match.team1?.name}
                  </h4>
                </div>

                {sportType === "cricket" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Runs
                      </label>
                      <input
                        {...register("scores.team1.teamRuns", {
                          required: "Runs are required",
                          min: {
                            value: 0,
                            message: "Runs must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team1?.teamRuns ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team1?.teamRuns && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team1.teamRuns.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Wickets
                      </label>
                      <input
                        {...register("scores.team1.teamWickets", {
                          required: "Wickets are required",
                          min: {
                            value: 0,
                            message: "Wickets must be non-negative",
                          },
                          max: { value: 10, message: "Maximum 10 wickets" },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team1?.teamWickets ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team1?.teamWickets && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team1.teamWickets.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Overs
                      </label>
                      <input
                        {...register("scores.team1.teamOvers", {
                          required: "Overs are required",
                          min: {
                            value: 0,
                            message: "Overs must be non-negative",
                          },
                        })}
                        type="number"
                        step="0.1"
                        className={`input mt-1 ${errors.scores?.team1?.teamOvers ? "input-error" : ""}`}
                        placeholder="20.0"
                      />
                      {errors.scores?.team1?.teamOvers && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team1.teamOvers.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Points
                      </label>
                      <input
                        {...register("scores.team1.teamPoints", {
                          required: "Points are required",
                          min: {
                            value: 0,
                            message: "Points must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team1?.teamPoints ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team1?.teamPoints && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team1.teamPoints.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sets Won
                      </label>
                      <input
                        {...register("scores.team1.setsWon", {
                          required: "Sets won are required",
                          min: {
                            value: 0,
                            message: "Sets won must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team1?.setsWon ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team1?.setsWon && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team1.setsWon.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Team 2 Score */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                    <TeamLogo teamName={match.team2?.name} size="md" />
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {match.team2?.name}
                  </h4>
                </div>

                {sportType === "cricket" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Runs
                      </label>
                      <input
                        {...register("scores.team2.teamRuns", {
                          required: "Runs are required",
                          min: {
                            value: 0,
                            message: "Runs must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team2?.teamRuns ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team2?.teamRuns && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team2.teamRuns.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Wickets
                      </label>
                      <input
                        {...register("scores.team2.teamWickets", {
                          required: "Wickets are required",
                          min: {
                            value: 0,
                            message: "Wickets must be non-negative",
                          },
                          max: { value: 10, message: "Maximum 10 wickets" },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team2?.teamWickets ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team2?.teamWickets && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team2.teamWickets.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Overs
                      </label>
                      <input
                        {...register("scores.team2.teamOvers", {
                          required: "Overs are required",
                          min: {
                            value: 0,
                            message: "Overs must be non-negative",
                          },
                        })}
                        type="number"
                        step="0.1"
                        className={`input mt-1 ${errors.scores?.team2?.teamOvers ? "input-error" : ""}`}
                        placeholder="20.0"
                      />
                      {errors.scores?.team2?.teamOvers && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team2.teamOvers.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Points
                      </label>
                      <input
                        {...register("scores.team2.teamPoints", {
                          required: "Points are required",
                          min: {
                            value: 0,
                            message: "Points must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team2?.teamPoints ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team2?.teamPoints && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team2.teamPoints.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sets Won
                      </label>
                      <input
                        {...register("scores.team2.setsWon", {
                          required: "Sets won are required",
                          min: {
                            value: 0,
                            message: "Sets won must be non-negative",
                          },
                        })}
                        type="number"
                        className={`input mt-1 ${errors.scores?.team2?.setsWon ? "input-error" : ""}`}
                        placeholder="0"
                      />
                      {errors.scores?.team2?.setsWon && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.scores.team2.setsWon.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden">
              <input
                {...register("sportType")}
                type="hidden"
                value={sportType}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Once submitted, the match result will update team statistics
                    and rankings. This action cannot be undone.
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
                    Updating...
                  </div>
                ) : (
                  "Update Result"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
