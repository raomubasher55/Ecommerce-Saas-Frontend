import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.jsx'; 
import './index.css';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { StoreNotificationProvider } from './context/StoreNotificationContext.jsx';
import { AdminNotificationProvider } from './context/AdminNotificationContext.jsx';
import { UserProvider } from './components/context/UserContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <UserProvider>
      <AdminNotificationProvider>
        <StoreNotificationProvider>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </StoreNotificationProvider>
      </AdminNotificationProvider>
    </UserProvider>
  </Provider>
);
