import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import InterviewForm from './pages/InterviewForm'
import InterviewPage from './pages/InterviewPage'
import Results from './pages/Results'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<InterviewForm />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App