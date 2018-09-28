import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import keplerGlReducer from 'kepler.gl/reducers';
import Processors from 'kepler.gl/processors';
import { loadConfig } from './actions';

import noonlightUsage from '../data/noonlightTrips.csv';
import hexConfig from '../data/hexbin-config';
import heatmapConfig from '../data/heatmap-config';

const data = Processors.processCsvData(noonlightUsage);

const initialAppState = {
  appName: 'noonlight_vis',
  dataset: {
    data,
    info: {
      id: 'my_data',
      label: 'Noonlight Trips'
    }
  },
  config: {
    selected: null,
    data: {},
    payloads: {
      hexbin: hexConfig,
      heatmap: heatmapConfig
    }
  }
};

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
  app: handleActions({
    [loadConfig](state, action) {
      const newState = Object.assign({}, state);
      newState.config.selected = action.payload;
      newState.config.data = state.config.payloads[action.payload];
      return newState;
    }
  }, initialAppState),
  routing: routerReducer
});

export default reducers;
