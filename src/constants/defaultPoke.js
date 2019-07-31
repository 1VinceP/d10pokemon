export default {
   id: 0,
   name: '',
   localId: '',
   level: 0,
   teamNum: 0,
   baseStats: {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0,
   },
   statsAtLevel: {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0,
   },
   moves: [],
   image: { front: '', back: '' },
   types: [''],
   lineage: {
      current: '',
      basic: '',
   },
   movesLocked: false,
   hasAttacked: false,
   hasMoved: false,
   coords: { row: 0, col: 0 },
};
