import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { teamService } from '../services/teamService';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TeamModal = ({ team, sportType, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!team;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: team || {
      name: '',
      shortCode: '',
      sportType: sportType,
      homeGround: '',
      foundedYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await teamService.updateTeam(team._id, data);
        toast.success('Team updated successfully');
      } else {
        await teamService.createTeam(data);
        toast.success('Team created successfully');
      }
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save team');
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
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Team' : 'Create New Team'}
            </h3>
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
                Team Name *
              </label>
              <input
                {...register('name', {
                  required: 'Team name is required',
                  minLength: {
                    value: 2,
                    message: 'Team name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Team name cannot exceed 50 characters',
                  },
                })}
                type="text"
                className={`input mt-1 ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter team name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">
                Short Code *
              </label>
              <input
                {...register('shortCode', {
                  required: 'Short code is required',
                  minLength: {
                    value: 2,
                    message: 'Short code must be at least 2 characters',
                  },
                  maxLength: {
                    value: 4,
                    message: 'Short code cannot exceed 4 characters',
                  },
                  pattern: {
                    value: /^[A-Z]+$/,
                    message: 'Short code must contain only uppercase letters',
                  },
                })}
                type="text"
                className={`input mt-1 ${errors.shortCode ? 'input-error' : ''}`}
                placeholder="e.g., MI, CSK"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.shortCode && (
                <p className="mt-1 text-sm text-red-600">{errors.shortCode.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="homeGround" className="block text-sm font-medium text-gray-700">
                Home Ground
              </label>
              <input
                {...register('homeGround', {
                  maxLength: {
                    value: 100,
                    message: 'Home ground name cannot exceed 100 characters',
                  },
                })}
                type="text"
                className={`input mt-1 ${errors.homeGround ? 'input-error' : ''}`}
                placeholder="Enter home ground name"
              />
              {errors.homeGround && (
                <p className="mt-1 text-sm text-red-600">{errors.homeGround.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                Founded Year
              </label>
              <input
                {...register('foundedYear', {
                  min: {
                    value: 1800,
                    message: 'Founded year must be after 1800',
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: 'Founded year cannot be in the future',
                  },
                })}
                type="number"
                className={`input mt-1 ${errors.foundedYear ? 'input-error' : ''}`}
                placeholder="e.g., 2008"
              />
              {errors.foundedYear && (
                <p className="mt-1 text-sm text-red-600">{errors.foundedYear.message}</p>
              )}
            </div>

            <div className="hidden">
              <input
                {...register('sportType')}
                type="hidden"
                value={sportType}
              />
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
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditing ? 'Update Team' : 'Create Team'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
