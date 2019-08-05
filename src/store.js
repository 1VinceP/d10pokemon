import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import trackingActionsReducer from './redux/trackingActionsReducer';
import teamReducer from './redux/teamReducer';
import d10Reducer from './redux/d10gameReducer';

const reducers = combineReducers({
   trackingActions: trackingActionsReducer,
   teams: teamReducer,
   d10: d10Reducer,
});

const composition = compose(
   applyMiddleware(promise, thunk),
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default createStore(
   reducers,
   composition,
);
