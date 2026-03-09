export const oversToBalls = (oversInput: string | number): number => {
    const value = typeof oversInput === 'string' ? parseFloat(oversInput) : oversInput
    if (isNaN(value)) return 0

    const overs = Math.floor(value)
    // Avoid precision issues (e.g., 0.30000000004)
    const balls = Math.round((value - overs) * 10)

    // Validation: Balls must be < 6 (allow 0-5)
    if (balls >= 6) {
        throw new Error(`Invalid overs format: .${balls} is not valid (must be .0 to .5)`)
    }

    return (overs * 6) + balls
}

export const ballsToOvers = (totalBalls: number): string => {
    const overs = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6
    return `${overs}.${balls}`
}

export const calculateNRR = (
    runsScored: number,
    oversFaced: string | number,
    runsConceded: number,
    oversBowled: string | number
): string => {
    const ballsFaced = oversToBalls(oversFaced)
    const ballsBowled = oversToBalls(oversBowled)

    if (ballsFaced === 0 || ballsBowled === 0) {
        throw new Error("Overs cannot be zero.")
    }

    // NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
    // Note: Total Overs Faced is (balls / 6)
    const oversFacedDecimal = ballsFaced / 6
    const oversBowledDecimal = ballsBowled / 6

    const runRateFor = runsScored / oversFacedDecimal
    const runRateAgainst = runsConceded / oversBowledDecimal

    return (runRateFor - runRateAgainst).toFixed(3)
}
