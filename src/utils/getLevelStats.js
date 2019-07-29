const levelModifiers = {
  0: .6,
  10: .7,
  20: .8,
  30: .9,
  40: 1,
  50: 1.1,
  60: 1.2,
  70: 1.3,
  80: 1.4,
  90: 1.5,
  100: 1.75,
};

export default ( stats ) => {
  const newStats = [];
  for( let i = 0; i < 100; i += 10) {
    newStats.push(getByLevel(stats, i));
  }
  return newStats;
}

export function getByLevel( stats, level ) {
  const newStats = { ...stats };
  for( let key in newStats ) {
    newStats[key] = Math.floor( newStats[key] * levelModifiers[level] );
  }
  return newStats;
}
