import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import InterviewForm from './pages/InterviewForm'
import InterviewPage from './pages/InterviewPage'
import Results from './pages/Results'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={
            <ProtectedRoute>
              <InterviewForm />
            </ProtectedRoute>
          } />
          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App