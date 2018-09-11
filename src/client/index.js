import React from 'react';
import { render }from 'react-dom';
import { Provider } from 'react-redux';
import document from 'global/document';
import { hashHistory, Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';
import App from './app';

const history = syncHistoryWithStore(hashHistory, store);

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  </Provider>
)

render(<Root />, document.getElementById('root'));
