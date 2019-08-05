import orderBy from 'lodash/orderBy';
import moment from 'moment';

import { pushDetailLog } from './trackingActionsReducer';
import roll from '../utils/roll';
import getSpeedBonus from '../constants/speedChart.constants';

const initialState = {
   gameStarted: false,
   initiative: [],
   log: [],
   selections: {
      attacker: '',
      attack: '',
      targets: [],
   },
   settings: {
      autoRoll: true,
   },
};

const SET_INITIATIVE = 'SET_INITIATIVE';
const ROTATE_INITIATIVE = 'ROTATE_INITIATIVE';
const PUSH_TO_LOG = 'PUSH_TO_LOG';
const REMOVE_LAST_LOG = 'REMOVE_LAST_LOG';
const CLEAR_LOG = 'CLEAR_LOG';
const SET_SELECTION = 'SET_SELECTION';
const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS';
const DEAL_DAMAGE = 'DEAL_DAMAGE';

function rotateInitiative( initiative ) {
   const old = initiative.shift();
   initiative.push(old);
   return { ...initiative };
}

export default ( state = initialState, { type, payload }) => {
   switch( type ) {
      case SET_INITIATIVE:
         return { ...state, initiative: payload, gameStarted: true };
      case ROTATE_INITIATIVE:
         return { ...state, initiative: rotateInitiative(payload) };

      case PUSH_TO_LOG:
         return { ...state, log: [...state.log, payload] };
      case REMOVE_LAST_LOG:
         return { ...state, log: [...state.log.slice(0, -1)] };
      case CLEAR_LOG:
         return { ...state, log: initialState.log };

      case SET_SELECTION:
         return {
            ...state,
            selections: { ...state.selections, [payload.target]: payload.value },
         };
      case CLEAR_SELECTIONS:
         return { ...state, selections: initialState.selections };

      case DEAL_DAMAGE:
         const newInitiative = [...state.initiative];
         newInitiative[0].currentStats.hp -= 10;
         return { ...state, initiative: newInitiative };

      default:
         return state;
   };
}

export function setInitiative({ team1, team2 }) {
   return dispatch => {
      dispatch(pushToLog('Game Start'));
      const t1 = team1.map((poke, i) => ({ ...poke, coords: { row: 5, col: i + 1 } }));
      const t2 = team2.map((poke, i) => ({ ...poke, coords: { row: 1, col: 10 - i } }));
      const all = [...t1, ...t2].map(poke => {
         const dieRoll = roll();
         const bonus = getSpeedBonus(poke.statsAtLevel.speed);
         const initiative = dieRoll + bonus;
         dispatch(pushToLog(`${poke.name} initiative is ${initiative} (${bonus} speed + ${dieRoll})`));
         return { ...poke, initiative };
      });
      const ordered = orderBy( all, ['initiative', 'name'], 'desc' );

      dispatch({ type: SET_INITIATIVE, payload: ordered });
   };
}

export function pushToLog( entry ) {
   return { type: PUSH_TO_LOG, payload: { entry, timestamp: moment() } };
}

export function removeLastLog() {
   return { type: REMOVE_LAST_LOG };
}

export function clearLog() {
   return { type: CLEAR_LOG };
}

export function setSelection( value ) {
   return ( dispatch, getState ) => {
      const { selections } = getState().d10;
      // if no attacker, set attacker
      if( !selections.attacker ) {
         dispatch({ type: SET_SELECTION, payload: { target: 'attacker', value } });
         dispatch(pushToLog(`${value.name} (Team${value.teamNum}) is attempting to attack (select a move)`));
         dispatch(pushDetailLog(`${value.name} set as attacker`));
      }
      else if( selections.attacker && !selections.attack ) {
         // remove attacker if selected again
         if( value.hasOwnProperty('localId') ) {
            dispatch({ type: SET_SELECTION, payload: { target: 'attacker', value: '' } });
            dispatch(removeLastLog());
            dispatch(pushDetailLog(`${value.name} deselected as attacker`));
         }
         // if attacker and no attack, determine if can set attack
         else {
            const atks = selections.attacker.moves.map(move => move.name);
            const hasAtk = atks.some(atk => atk === value.name);
            // if attacker has the selected attack, set attack
            if( hasAtk ) {
               dispatch({ type: SET_SELECTION, payload: { target: 'attack', value } });
               dispatch(pushToLog(` with ${value.name} (select a target(s))`));
               dispatch(pushDetailLog(`${value.name} set as attack`));
            }
            else {
               dispatch(pushDetailLog(`${value.name} was selected, but ${selections.attacker.name} does not know that move`));
            }
         }
      }
      else {
         // remove attack if selected again
         if( !value.hasOwnProperty('localId') ) {
            if( value.name === selections.attack.name ) {
               dispatch({ type: SET_SELECTION, payload: { target: 'attack', value: '' } });
               dispatch(removeLastLog());
               dispatch(pushDetailLog(`${value.name} deselected as attack`));
            }
         }
         // if attacker and attack, set targets
         else {
            const newTargets = [...selections.targets, value];
            dispatch({ type: SET_SELECTION, payload: { target: 'targets', value: newTargets } });
            dispatch(pushToLog(` with ${value.name} (Team${value.teamNum}) as a target`));
            dispatch(pushDetailLog(`${value.name} added to targets`));
            // dispatch(handleAttack());
            // dispatch(clearSelections());
            // dispatch(pushDetailLog('Selections cleared'));
         }
      }
   };
}

export function clearSelections() {
   return { type: CLEAR_SELECTIONS };
}

function handleAttack() {}
