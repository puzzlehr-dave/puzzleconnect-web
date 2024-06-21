
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import AppState from './contexts/AppState';

import tests from './api/tests';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    // <React.StrictMode>
        <AppState>
            <App />
        </AppState>
    // </React.StrictMode>
);

tests();
