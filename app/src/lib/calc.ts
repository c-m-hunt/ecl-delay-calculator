export interface Response {
  target?: number
  targetRunRate?: number
  targetExact?: boolean
  overs: number
  maxPerBowler: number
  powerPlay: number
}

export const config = {
  startingOvers: 45,
  overMinutes: 4,
  teaLength: 20,
  freeTime: 30,
  minOversCutoff: 20,
}

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
    throw Error('Less than 20 overs available - ABANDON GAME')
  }

  return {
    overs,
    maxPerBowler: Math.floor(overs / 5),
    powerPlay: calculatePowerPlay(overs),
  }
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
    throw Error('Less than 20 overs available - ABANDON GAME')
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
  }
}
