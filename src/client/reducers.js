import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import keplerGlReducer from 'kepler.gl/reducers';

const initialAppState = {
  appName: 'noonlight_vis',
  loaded: false,
};

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
  app: handleActions({
    // TOGGLE_METRO: (state, action) => {
    //   let { metroVisible } = state;
    //   let newState = Object.assign({}, state, { metroVisible: !metroVisible });
      
    //   return newState;
    // },
    // TOGGLE_FILTER: (state, action) => {
    //   let { metroFiltered } = state;
    //   let newState = Object.assign({}, state, { metroFiltered: !metroFiltered });

    //   return newState;
    // }
  }, initialAppState),
  routing: routerReducer
});

export default reducers;
