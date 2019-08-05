import moment from 'moment';

const initialState = [];

const PUSH_DETAIL_LOG = 'PUSH_DETAIL_LOG';
const CLEAR_DETAIL_LOG = 'CLEAR_DETAIL_LOG';

export default ( state = initialState, { type, payload } ) => {
   switch( type ) {
      case PUSH_DETAIL_LOG:
         return [...state,  payload];

      case CLEAR_DETAIL_LOG:
         return initialState;

      default:
         return state;
   }
}

export function pushDetailLog( entry ) {
   return { type: PUSH_DETAIL_LOG, payload: { entry, timestamp: moment() } };
}

export function clearDetailLog() {
   return { type: CLEAR_DETAIL_LOG };
}
