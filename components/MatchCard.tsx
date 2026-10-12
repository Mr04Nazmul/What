import { useEffect, useState } from 'react';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'PRE' | 'FINISHED';
  minute?: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

const MatchCard = ({ match, onBetSelect }: { match: Match; onBetSelect: (selection: string, odds: number) => void }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (selection: 'home' | 'draw' | 'away') => {
    const newSelection = selected === selection ? null : selection;
    setSelected(newSelection);
    if (newSelection) {
      const odds = match.odds[selection];
      onBetSelect(selection, odds);
    }
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-lg p-3 mb-2 hover:bg-[#252525] transition-colors">
      {/* Header: Time & Status */}
      <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
        <span>{match.status === 'LIVE' ? `🔴 LIVE ${match.minute}'` : match.status}</span>
        <span>ID: {match.id}</span>
      </div>

      {/* Teams & Score */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <p className="font-bold text-white truncate">{match.homeTeam}</p>
          <span className={`text-lg font-bold ${match.homeScore > match.awayScore ? 'text-green-400' : 'text-gray-300'}`}>
            {match.homeScore}
          </span>
        </div>
        <div className="flex-1 text-right">
          <p className="font-bold text-white truncate">{match.awayTeam}</p>
          <span className={`text-lg font-bold ${match.awayScore > match.homeScore ? 'text-green-400' : 'text-gray-300'}`}>
            {match.awayScore}
          </span>
        </div>
      </div>

      {/* 1X2 Odds Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {(['home', 'draw', 'away'] as const).map((key) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`py-2 rounded-md text-sm font-bold transition-all border ${
              selected === key
                ? 'bg-green-600 border-green-400 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="text-xs uppercase">{key === 'home' ? '1' : key === 'draw' ? 'X' : '2'}</div>
            <div>{match.odds[key].toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MatchCard;
