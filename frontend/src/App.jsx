import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { setTokenRefreshFunction } from './api/axios';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import InterviewForm from './pages/InterviewForm';
import InterviewPage from './pages/InterviewPage';
import Profile from './pages/Profile';

const App = () => {
  const { getToken } = useAuth();

  // Set up token refresh function for API calls
  useEffect(() => {
    if (getToken) {
      setTokenRefreshFunction(getToken);
    }
  }, [getToken]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/form'
            element={
              <ProtectedRoute>
                <InterviewForm />
              </ProtectedRoute>
            }
          />
          <Route
            path='/interview/:id'
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/*'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

