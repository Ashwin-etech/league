import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PlayerModal = ({ team, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      jerseyNumber: '',
      role: 'player',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await teamService.addPlayer(team._id, data);
      toast.success('Player added successfully');
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose(false);
  };

  const playerRoles = team.sportType === 'cricket' 
    ? ['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'player']
    : ['player'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Add Player</h3>
              <p className="text-sm text-gray-500 mt-1">Team: {team.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Player Name *
              </label>
              <input
                {...register('name', {
                  required: 'Player name is required',
                  minLength: {
                    value: 2,
                    message: 'Player name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Player name cannot exceed 50 characters',
                  },
                })}
                type="text"
                className={`input mt-1 ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter player name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700">
                Jersey Number *
              </label>
              <input
                {...register('jerseyNumber', {
                  required: 'Jersey number is required',
                  min: {
                    value: 1,
                    message: 'Jersey number must be at least 1',
                  },
                  max: {
                    value: 99,
                    message: 'Jersey number cannot exceed 99',
                  },
                })}
                type="number"
                className={`input mt-1 ${errors.jerseyNumber ? 'input-error' : ''}`}
                placeholder="Enter jersey number (1-99)"
              />
              {errors.jerseyNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.jerseyNumber.message}</p>
              )}
            </div>

            {team.sportType === 'cricket' && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Player Role
                </label>
                <select
                  {...register('role')}
                  className={`input mt-1 ${errors.role ? 'input-error' : ''}`}
                >
                  {playerRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Make sure the jersey number is unique within the team.
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Player'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
