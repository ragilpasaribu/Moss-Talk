import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {RouterProvider} from 'react-router-dom';
import router from './routes/index.jsx';
import {Provider} from 'react-redux';
import Store from './redux/Store.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>,
);
