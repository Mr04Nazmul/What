// cashOutService.ts
export function calculateCashOutValue(originalStake: number, originalOdds: number, currentOdds: number, matchProgress: number): number {
    // matchProgress: 0.0 to 1.0 (0% to 100% of match time)
    // Simple Model: Value decreases as match progresses and odds fluctuate
    
    const riskFactor = 1 - (matchProgress * 0.5); // Higher risk if match is late
    const currentPotential = originalStake * originalOdds;
    const currentMarketValue = originalStake * (currentOdds / originalOdds);
    
    // Cash out is usually slightly less than market value to account for bookmaker margin
    const cashOutValue = currentMarketValue * riskFactor * 0.95; 
    
    return Math.max(cashOutValue, 0);
}
