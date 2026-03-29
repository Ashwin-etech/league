import React from "react";

const TEAM_LOGOS = {
  "IMJ Ignitors": "/logos/ignitors.png",
  "IMJ Falcons": "/logos/falcons.png",
  "IMJ Hawks": "/logos/hawks.png",
  "IMJ Phantoms": "/logos/phantoms.png",
  "IMJ Titans": "/logos/titans.png",
  "IMJ Ninjas": "/logos/ninjas.png",
};

const TEAM_COLORS = {
  "IMJ Ignitors": "bg-orange-100 text-orange-600",
  "IMJ Falcons": "bg-blue-100 text-blue-600",
  "IMJ Hawks": "bg-red-100 text-red-600",
  "IMJ Phantoms": "bg-purple-100 text-purple-600",
  "IMJ Titans": "bg-green-100 text-green-600",
  "IMJ Ninjas": "bg-gray-100 text-gray-600",
};

const TeamLogo = ({ teamName, className = "", size = "md" }) => {
  const [showInitials, setShowInitials] = React.useState(false);
  const logoPath = TEAM_LOGOS[teamName] || "";

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const initials =
    teamName?.split(" ")[1]?.substring(0, 2).toUpperCase() || "??";

  const wrapperClass = `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${className}`;

  if (logoPath && !showInitials) {
    return (
      <img
        src={logoPath}
        alt={teamName}
        className={`${sizeClasses[size]} object-contain rounded-full ${className}`}
        onError={() => setShowInitials(true)}
      />
    );
  }

  return (
    <div className={`${wrapperClass} ${TEAM_COLORS[teamName] || "bg-gray-100 text-gray-600"}`}>
      {initials}
    </div>
  );
};

export default TeamLogo;
