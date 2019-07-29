import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import teamReducer from './redux/teamReducer';

const reducers = combineReducers({
  teams: teamReducer,
});

const composition = compose(
   applyMiddleware( promise, thunk ),
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default createStore(
   reducers,
   composition,
);
