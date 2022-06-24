import React from 'react';
import ReactDOM from 'react-dom';

import App from './app'
import {DbContext} from './db'
ReactDOM.render(<DbContext><App /></DbContext>, document.querySelector('#root'));