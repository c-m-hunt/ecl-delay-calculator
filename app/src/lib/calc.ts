export interface Response {
  target?: number
  targetRunRate?: number
  targetExact?: boolean
  overs: number
  maxPerBowler: number
  powerPlay: number
  breakType: BreakType
}

export enum BreakType {
  BEFORE,
  FIRST,
  SECOND
}

export const config = {
  startingOvers: 45,
  overMinutes: 4,
  teaLength: 20,
  freeTime: 30,
  minOversCutoff: 20,
}

const messages = {
  notEnoughOvers: 'Less than 20 overs available - ABANDON GAME'
}

const calculatePowerPlay = (overs: number) => {
  let powerPlay = 6
  if (overs >= 20 && overs <= 23) {
    powerPlay = 6
  } else if (overs >= 24 && overs <= 26) {
    powerPlay = 7
  } else if (overs >= 27 && overs <= 29) {
    powerPlay = 8
  } else if (overs >= 30 && overs <= 33) {
    powerPlay = 9
  } else if (overs >= 34 && overs <= 36) {
    powerPlay = 10
  } else if (overs >= 37 && overs <= 39) {
    powerPlay = 11
  } else if (overs >= 40 && overs <= 45) {
    powerPlay = 12
  }
  return powerPlay
}

/**
 *
 * @param minutesLost Minutes lost before the start of the match
 * @param teaTaken Whether tea was taken during the delay
 */
export const matchStartLate = (
  minutesLost: number,
  teaTaken: boolean = false
): Response => {
  let minutesLostIncTea = teaTaken
    ? minutesLost - config.teaLength
    : minutesLost
  minutesLostIncTea = minutesLostIncTea - config.freeTime
  let overs = config.startingOvers
  if (minutesLostIncTea > 0) {
    overs =
      config.startingOvers -
      Math.ceil(minutesLostIncTea / (config.overMinutes * 2))
  }

  if (overs < config.minOversCutoff) {
    throw Error(messages.notEnoughOvers)
  }

  return {
    overs,
    maxPerBowler: Math.floor(overs / 5),
    powerPlay: calculatePowerPlay(overs),
    breakType: BreakType.BEFORE
  }
}

/**
 * Calculate the new playing conditions for delay during 1st innings
 * @param total Total runs scored in the 1st innings
 * @param oversCompleted Overs completed at the end of the first innings
 * @param minutesLost Time lost in minutes
 * @param teaTaken Whether tea was taken during the delay
 * @param oversTarget Scheduled amount of overs at the start of the first innings
 */
export const firstInningsTimeLost = (
  total: number,
  oversCompleted: number,
  minutesLost: number,
  teaTaken: boolean = false,
  oversTarget: number = config.startingOvers
): Response => {
  const runRate = total / oversTarget
  const overMinutes = config.overMinutes
  let minutesLostIncTea = teaTaken
    ? minutesLost - config.teaLength
    : minutesLost
  // Remove the 30 free minutes
  minutesLostIncTea = minutesLostIncTea - config.freeTime
  minutesLostIncTea = Math.ceil(minutesLostIncTea / overMinutes) * overMinutes
  let overs = config.startingOvers
  if (minutesLostIncTea > 0) {
    const oversLost = minutesLostIncTea / overMinutes
    overs = oversTarget - oversLost + (oversTarget - Math.ceil(oversCompleted))
  }

  const targetRunRate = ((100 + (oversTarget - overs) * 1.5) * runRate) / 100

  if (overs < config.minOversCutoff) {
    throw Error(messages.notEnoughOvers)
  }

  const target = targetRunRate * overs;
  const targetExact = target === Math.ceil(target);
  return {
    overs,
    targetExact,
    targetRunRate: parseFloat(targetRunRate.toFixed(2)),
    maxPerBowler: Math.floor(overs / 5),
    powerPlay: calculatePowerPlay(overs),
    target: Math.ceil(target) + (targetExact ? 1 : 0),
    breakType: BreakType.FIRST
  }
}

/**
 * Calculate the new playing conditions for delay during 2nd innings
 * @param minutesLost Time lost in minutes
 * @param targetOvers Target overs before the delay in play
 * @param targetRunRate Target run rate before the delay in play
 */
export const secondInningsTimeLost = (
  minutesLost: number,
  targetOvers: number,
  targetRunRate: number
): Response => {
  const overs = targetOvers - (Math.ceil((minutesLost - config.freeTime) / config.overMinutes))
  const target = overs * targetRunRate
  const targetExact = target === Math.ceil(target);

  if (overs < config.minOversCutoff) {
    throw Error(messages.notEnoughOvers)
  }

  return {
    overs,
    targetExact,
    targetRunRate: parseFloat(targetRunRate.toFixed(2)),
    maxPerBowler: Math.floor(overs / 5),
    powerPlay: calculatePowerPlay(overs),
    target: Math.ceil(target) + (targetExact ? 1 : 0),
    breakType: BreakType.SECOND
  }
}