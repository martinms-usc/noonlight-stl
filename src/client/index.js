import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import document from 'global/document';
import store from './store';
import App from './app';

// to enable react-router and view routing
// import { hashHistory, Router, Route } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
// const history = syncHistoryWithStore(hashHistory, store);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

// const Root = () => (
//   <Provider store={store}>
//     <Router history={history}>
//       <Route path='/' component={App} />
//     </Router>
//   </Provider>
// )

render(<Root />, document.getElementById('root'));
