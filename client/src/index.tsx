import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Routes } from 'routes';
import { ToastNotification } from 'design-system';
import { createStore } from 'store';

import './less/index.less';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <ToastNotification />
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
