import React, { createContext, useContext, useState } from 'react';

const SportContext = createContext();

const SPORT_TYPES = {
  CRICKET: 'cricket',
  THROWBALL: 'throwball',
};

const SPORT_CONFIG = {
  [SPORT_TYPES.CRICKET]: {
    name: 'Cricket',
    color: 'cricket',
    icon: '🏏',
    description: 'T20 Cricket League',
    maxOvers: 20,
    maxWickets: 10,
    scoringFields: ['runs', 'wickets', 'overs', 'netRunRate'],
  },
  [SPORT_TYPES.THROWBALL]: {
    name: 'Throwball',
    color: 'throwball',
    icon: '🤾',
    description: 'Throwball Championship',
    maxSets: 3,
    scoringFields: ['points', 'setsWon'],
  },
};

export const SportProvider = ({ children }) => {
  const [selectedSport, setSelectedSport] = useState(SPORT_TYPES.CRICKET);

  const switchSport = (sport) => {
    if (Object.values(SPORT_TYPES).includes(sport)) {
      setSelectedSport(sport);
    }
  };

  const getCurrentSportConfig = () => {
    return SPORT_CONFIG[selectedSport];
  };

  const getSportIcon = (sport) => {
    return SPORT_CONFIG[sport]?.icon || '🏆';
  };

  const getSportColor = (sport) => {
    return SPORT_CONFIG[sport]?.color || 'primary';
  };

  const value = {
    selectedSport,
    switchSport,
    getCurrentSportConfig,
    getSportIcon,
    getSportColor,
    SPORT_TYPES,
    SPORT_CONFIG,
  };

  return (
    <SportContext.Provider value={value}>
      {children}
    </SportContext.Provider>
  );
};

export const useSport = () => {
  const context = useContext(SportContext);
  if (!context) {
    throw new Error('useSport must be used within a SportProvider');
  }
  return context;
};
