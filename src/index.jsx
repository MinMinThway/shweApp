import React from 'react';
import { createRoot } from 'react-dom/client';

import { ConfigProvider } from './contexts/ConfigContext';
import {AuthProvider} from '../AuthContext'
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <AuthProvider>
  <ConfigProvider>
   
    <App />
  </ConfigProvider>
  </AuthProvider>
);

reportWebVitals();
