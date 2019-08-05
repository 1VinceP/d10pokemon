import axios from 'axios';
import startCase from 'lodash/startCase';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

import { getByLevel } from '../utils/getLevelStats';

const initialState = {
   team1: [],
   team2: [],
   fetching: false,
   limit: 6,
}

const FETCH_POKE = 'FETCH_POKE';
const SET_MOVES = 'SET_MOVES';
const DELETE_POKE = 'DELETE_POKE';
const LOAD_POKE = 'LOAD_POKE';

export default (state = initialState, { type, payload = { teamNum: 0 } }) => {
   const targetTeam = `team${payload.teamNum}`;
   switch (type) {
      case FETCH_POKE + '_PENDING':
         return { ...state, fetching: true }
      case FETCH_POKE + '_FULFILLED': {
         const newTeam = [
            ...state[targetTeam],
            { ...payload, currentHp: payload.statsAtLevel.hp, localId: moment() },
         ];
         return {
            ...state,
            [targetTeam]: newTeam,
            fetching: false,
         }
      }
      case FETCH_POKE + '_REJECTED':
         return { ...state, fetching: false }

      case SET_MOVES + '_FULFILLED': {
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

      case LOAD_POKE: {
         const newTeam = [...state[targetTeam]];
         newTeam.push(payload.poke);
         return {
            ...state,
            [targetTeam]: newTeam,
         };
      }

      default:
         return state
   }
}

function formatEvolution({ chain }, currentName) {
   const getEvo = set => set.species.name;
   const evos = {
      current: '',
      hasBaby: false,
   };

   evos.hasBaby = chain.is_baby; // set if evo chain has a baby
   evos.basic = getEvo(chain); // set the basic pokemon
   if (chain.evolves_to.length > 0) { // set stage1 evos
      evos.stage1 = chain.evolves_to.map(set => getEvo(set));
      if (chain.evolves_to.every(set => set.evolves_to.length > 0)) { // set stage2 evos
         evos.stage2 = chain.evolves_to.map(set => set.evolves_to.map(newSet => getEvo(newSet)));
      }
   }

   // set current stage
   if (evos.basic === currentName.toLowerCase()) evos.current = 'basic';
   else if (evos.stage1.findIndex(poke => poke === currentName.toLowerCase()) >= 0) evos.current = 'stage1';
   else evos.current = 'stage2';

   return evos;
}

function formatStats(stats, level) {
   const result = {};
   for (let key in stats) {
      const prop = stats[key].stat.name;
      result[prop] = stats[key].base_stat;
   }
   return {
      baseStats: result,
      statsAtLevel: getByLevel(result, level),
   };
}

function formatTypes(types) {
   const result = [];
   sortBy(types, 'slot').forEach(type => result.push(startCase(type.type.name)));
   return result;
}

function formatMoves(moves) {
   const result = [];
   for (let key in moves) {
      result.push({
         name: startCase(moves[key].move.name),
         link: moves[key].move.url,
      });
   }

   return sortBy(result, 'name');
}

export function fetchPoke(name, level, teamNum) {
   return {
      type: FETCH_POKE,
      payload: async () => {
         const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
         const speciesData = await axios.get(poke.data.species.url);
         const evolutionChain = await axios.get(speciesData.data.evolution_chain.url);

         const { id, name: pokeName, sprites, types, stats, moves } = poke.data;
         const { baseStats, statsAtLevel } = formatStats(stats, Math.floor(level / 10) * 10);

         return {
            id,
            name: startCase(pokeName),
            types: formatTypes(types),
            moves: formatMoves(moves),
            lineage: formatEvolution(evolutionChain.data, name),
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
            hasMoved: false,
            hasAttacked: false,
         };
      },
   };
}

function formatDetailMove(move) {
   const {
      contest_combos,
      contest_type,
      contest_effect,
      super_contest_effect,
      names,
      name,
      type,
      ...rest
   } = move;

   return {
      ...rest,
      name: startCase(name),
      type: startCase(type.name),
   };
}

export function setMoves(moves, teamNum, pokeId) {
   const getMove = url => axios.get(url);

   return {
      type: SET_MOVES,
      payload: async () => {
         const newMoves = await Promise.all([
            getMove(moves[0].link),
            getMove(moves[1].link),
            getMove(moves[2].link),
            getMove(moves[3].link),
         ]);

         return {
            moves: newMoves.map(move => formatDetailMove(move.data)),
            teamNum,
            pokeId,
         };
      },
   };
}

export function deletePoke(teamNum, localId) {
   return {
      type: DELETE_POKE,
      payload: { teamNum, localId },
   };
}

export function loadPoke( teamNum, poke ) {
   const updatedPoke = {
      ...poke,
      localId: moment(),
      teamNum,
   };

   return {
      type: LOAD_POKE,
      payload: { teamNum, poke: updatedPoke },
   };
}
