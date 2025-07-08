import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
// import Goals from './components/Goals';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              {/* <Route path="/goals" element={<Goals />} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
