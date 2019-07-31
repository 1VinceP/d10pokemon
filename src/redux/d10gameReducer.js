import orderBy from 'lodash/orderBy';

import defaultPoke from '../constants/defaultPoke';
import roll from '../utils/roll';
import getSpeedBonus from '../constants/speedChart.constants';

const initialState = {
   initiative: [{ ...defaultPoke }],
};

const SET_INITIATIVE = 'SET_INITIATIVE';
const ROTATE_INITIATIVE = 'ROTATE_INITIATIVE';

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

      default:
         return state;
   };
}

export function setInitiative({ team1, team2 }) {
   const all = [...team1, ...team2].map(poke => {
      const dieRoll = roll();
      const bonus = getSpeedBonus(poke.statsAtLevel.speed);
      const initiative = dieRoll + bonus;
      return { ...poke, initiative };
   });
   const ordered = orderBy( all, ['initiative', 'name'], 'desc' );

   return { type: SET_INITIATIVE, payload: ordered };
}
