import React from 'react';
import ReactDOM from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';

import App from './App';

const root = document.getElementById('root');

// Use createRoot API instead of ReactDOM.render
ReactDOM.createRoot(root).render(<App />);