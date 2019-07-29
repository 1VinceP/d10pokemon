import axios from 'axios';
import startCase from 'lodash/startCase';
import sortBy from 'lodash/sortBy';
import { getByLevel } from '../utils/getLevelStats';

const initialState = {
  team1: [{
    name: 'firemon',
    id: -1,
    localId: 999,
    level: 70,
    baseStats: {
      hp: 10,
      attack: 20,
      defense: 30,
      'special-attack': 40,
      'special-defense': 50,
      speed: 60,
    },
    statsAtLevel: {
      hp: 100,
      attack: 200,
      defense: 300,
      'special-attack': 400,
      'special-defense': 500,
      speed: 600,
    },
    moves: [
      { name: 'ember', link: 'google.com' },
      { name: 'flamethrower', link: 'google.com' },
      { name: 'defence curl', link: 'google.com' },
      { name: 'hyper beam', link: 'google.com' },
    ],
    image: { front: '' },
    types: ['Fire'],
    movesLocked: false,
  }],
  team2: [],
  fetching: false,
  limit: 6,
}

const FETCH_POKE = 'FETCH_POKE';
const SET_MOVES = 'SET_MOVES';
const DELETE_POKE = 'DELETE_POKE';

export default ( state = initialState, { type, payload = { teamNum: 0 } } ) => {
  const targetTeam = `team${payload.teamNum}`;
  switch( type ) {
    case FETCH_POKE + '_PENDING':
      return { ...state, fetching: true }
    case FETCH_POKE + '_FULFILLED': {
      const newTeam = [
        ...state[targetTeam],
        { ...payload, currentHp: payload.statsAtLevel.hp, localId: new Date() },
      ];
      return {
        ...state,
        [targetTeam]: newTeam,
        fetching: false,
      }
    }
    case FETCH_POKE + '_REJECTED':
      return { ...state, fetching: false }

    case SET_MOVES: {
      const newTeam = [...state[targetTeam]];
      const newPokeIndex = newTeam.findIndex(poke => poke.localId === payload.pokeId);
      newTeam[newPokeIndex].moves = [...payload.moves];
      newTeam[newPokeIndex].movesLocked = true;
      return {
        ...state,
        [targetTeam]: newTeam,
      };
    }

    case DELETE_POKE: {
      const newTeam = [...state[targetTeam]];
      const pokeIndex = newTeam.findIndex(poke => poke.localId === payload.localId);
      newTeam.splice(pokeIndex, 1);
      return {
        ...state,
        [targetTeam]: newTeam,
      };
    }

    default:
      return state
  }
}

function formatEvolution( { chain }, currentName ) {
  let stage = currentName === chain.species.name ? 0
    : chain.evolves_to.some(poke => poke.species.name === currentName.split('-')[0]) ? 1
    : 2;
  if( chain.is_baby ) stage -= 1;
  console.log(stage);
  let nextStage;
  if( stage === 0 && chain.evolves_to.length > 0 ) {
    nextStage = chain.evolves_to.map(poke => poke.species.name);
  }

  return nextStage;
}

function formatStats( stats, level ) {
  const result = {};
  for( let key in stats ) {
    const prop = stats[key].stat.name;
    result[prop] = stats[key].base_stat;
  }
  return {
    baseStats: result,
    statsAtLevel: getByLevel(result, level),
  };
}

function formatTypes( types ) {
  const result = [];
  sortBy(types, 'slot').forEach(type => result.push(startCase(type.type.name)));
  return result;
}

function formatMoves(moves) {
  const result = [];
  for( let key in moves ) {
    result.push({
      name: startCase(moves[key].move.name),
      link: moves[key].move.url,
    });
  }

  return sortBy(result, 'name');
}

export function fetchPoke( name, level, teamNum ) {
  return {
    type: FETCH_POKE,
    payload: async () => {
      ///// TODO: initial call to species? /////
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const { id, name: pokeName, sprites, types, stats, moves, species } = poke.data;
      const { baseStats, statsAtLevel } = formatStats(stats, level);
      const speciesData = await axios.get(species.url);
      const evolutionChain = await axios.get(speciesData.data.evolution_chain.url);

      return {
        id,
        name: startCase(pokeName),
        types: formatTypes(types),
        moves: formatMoves(moves),
        evolution: formatEvolution(evolutionChain.data, name),
        image: {
          front: sprites.front_default,
          back: sprites.back_default,
        },
        exp: 0,
        baseStats,
        statsAtLevel,
        level,
        teamNum,
        movesLocked: false,
      };
    },
  };
}

export function setMoves(moves, teamNum, pokeId) {
  return {
    type: SET_MOVES,
    payload: {
      moves: [...moves],
      teamNum,
      pokeId,
    },
  };
}

export function deletePoke(teamNum, localId) {
  return {
    type: DELETE_POKE,
    payload: { teamNum, localId },
  };
}
