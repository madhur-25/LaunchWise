import { useAuth } from './context/AuthContext';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Toaster is for the pop-up notifications, needs to be at the top level */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* This is the main router for the app. 
        If the user is logged in, show the dashboard, otherwise show the login page.
      */}
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
}

export default App;

