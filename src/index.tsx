import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import i18n (needs to be bundled ;))
import './i18n';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
