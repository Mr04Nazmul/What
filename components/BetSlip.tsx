interface Bet {
  id: string;
  selection: string;
  odds: number;
  stake: number;
}

const BetSlip = ({ bets, updateStake, removeBet, placeBet }: any) => {
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotential = bets.reduce((sum, bet) => sum + (bet.stake * bet.odds), 0);

  return (
    <div className="fixed bottom-0 right-0 left-0 bg-[#1e1e1e] border-t border-gray-800 p-4 z-50 max-h-[50vh] overflow-y-auto md:static md:w-80 md:h-full">
      <h3 className="text-white font-bold mb-2">Bet Slip ({bets.length})</h3>
      
      {bets.length === 0 ? (
        <p className="text-gray-500 text-sm">Select odds to add to bet slip</p>
      ) : (
        <>
          {bets.map((bet: Bet) => (
            <div key={bet.id} className="flex justify-between items-center border-b border-gray-800 py-2">
              <div>
                <p className="text-white text-sm">{bet.selection}</p>
                <p className="text-green-400 text-xs">@{bet.odds.toFixed(2)}</p>
              </div>
              <input
                type="number"
                value={bet.stake}
                onChange={(e) => updateStake(bet.id, parseFloat(e.target.value))}
                className="w-20 bg-gray-800 text-white p-1 rounded text-right border border-gray-700"
                placeholder="0.00"
              />
              <button onClick={() => removeBet(bet.id)} className="text-red-500 ml-2">✖</button>
            </div>
          ))}
          
          <div className="mt-4 flex justify-between text-white text-sm">
            <span>Total Stake: ৳{totalStake.toFixed(2)}</span>
            <span>Potential Win: ৳{totalPotential.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={placeBet}
            disabled={totalStake <= 0}
            className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            Place Bet
          </button>
        </>
      )}
    </div>
  );
};

export default BetSlip;
