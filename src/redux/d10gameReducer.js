import orderBy from 'lodash/orderBy';
import moment from 'moment';

import defaultPoke from '../constants/defaultPoke';
import roll from '../utils/roll';
import getSpeedBonus from '../constants/speedChart.constants';

const initialState = {
   initiative: [{ ...defaultPoke }],
   log: [],
   detailLog: [],
   selections: {
      attacker: '',
      attack: '',
      targets: [],
   },
};

const SET_INITIATIVE = 'SET_INITIATIVE';
const ROTATE_INITIATIVE = 'ROTATE_INITIATIVE';
const PUSH_TO_LOG = 'PUSH_TO_LOG';
const CLEAR_LOG = 'CLEAR_LOG';
const PUSH_DETAIL_LOG = 'PUSH_DETAIL_LOG';
const CLEAR_DETAIL_LOG = 'CLEAR_DETAIL_LOG';
const SET_SELECTION = 'SET_SELECTION';
const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS';

function rotateInitiative( initiative ) {
   const old = initiative.shift();
   initiative.push(old);
   return { ...initiative };
}

export default ( state = initialState, { type, payload }) => {
   switch( type ) {
      case SET_INITIATIVE:
         return { ...state, initiative: payload };
      case ROTATE_INITIATIVE:
         return { ...state, initiative: rotateInitiative(payload) };

      case PUSH_TO_LOG:
         return { ...state, log: [...state.log, payload] };
      case CLEAR_LOG:
         return { ...state, log: initialState.log };

      case PUSH_DETAIL_LOG:
         return { ...state, detailLog: [...state.detailLog, payload] };
      case CLEAR_DETAIL_LOG:
         return { ...state, detailLog: initialState.detailLog };

      case SET_SELECTION:
         return {
            ...state,
            selections: { ...state.selections, [payload.target]: payload.value },
         };
      case CLEAR_SELECTIONS:
         return { ...state, selections: initialState.selections };

      default:
         return state;
   };
}

export function setInitiative({ team1, team2 }) {
   const t1 = team1.map((poke, i) => ({ ...poke, coords: { row: 5, col: i + 1 } }));
   const t2 = team2.map((poke, i) => ({ ...poke, coords: { row: 1, col: 10 - i } }));
   const all = [...t1, ...t2].map(poke => {
      const dieRoll = roll();
      const bonus = getSpeedBonus(poke.statsAtLevel.speed);
      const initiative = dieRoll + bonus;
      return { ...poke, initiative };
   });
   const ordered = orderBy( all, ['initiative', 'name'], 'desc' );

   return { type: SET_INITIATIVE, payload: ordered };
}

export function pushToLog( entry ) {
   return { type: PUSH_TO_LOG, payload: { entry, timestamp: moment() } };
}

export function clearLog() {
   return { type: CLEAR_LOG };
}

export function pushDetailLog( entry ) {
   return { type: PUSH_DETAIL_LOG, payload: { entry, timestamp: moment() } };
}

export function clearDetailLog() {
   return { type: CLEAR_DETAIL_LOG };
}

export function setSelection( value ) {
   return ( dispatch, getState ) => {
      const { selections } = getState().d10;
      if( !selections.attacker ) {
         dispatch({ type: SET_SELECTION, payload: { target: 'attacker', value } });
         dispatch(pushToLog(`${value.name} (Team${value.teamNum}) is attempting to attack (select a move)`));
         dispatch(pushDetailLog(`${value.name} set as attacker`));
      }
      else if( selections.attacker && !selections.attack ) {
         dispatch({ type: SET_SELECTION, payload: { target: 'attack', value } });
         dispatch(pushToLog(` with ${value.name} (select a target(s))`));
         dispatch(pushDetailLog(`${value.name} set as attack`));
      }
      else {
         const newTargets = [...selections.targets, value];
         dispatch({ type: SET_SELECTION, payload: { target: 'targets', value: newTargets } });
         dispatch(pushToLog(` with ${value.name} (Team${value.teamNum}) as a target`));
         dispatch(pushDetailLog(`${value.name} added to targets`));
         dispatch(handleAttack());
      }
   }
}

export function clearSelections() {
   return { type: CLEAR_SELECTIONS };
}

function handleAttack() {}
