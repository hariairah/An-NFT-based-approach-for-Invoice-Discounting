import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Portfolio from './pages/Portfolio';
import Invest from './pages/Invest';
import Sell from './pages/Sell';
import Unsigned from './pages/Unsigned';
import Settings from './pages/Settings';
import Preview from './pages/Preview';
import Authentication from './pages/Authentication';
import './App.css'

function App() {
  const [tokensForSale, setTokensForSale] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/main-app/*" 
          element={
            <Sidebar>
              <Routes>
                <Route index element={<Portfolio />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="invest" element={<Invest />} />
                <Route path="sell" element={<Sell />} />
                <Route path="unsigned" element={<Unsigned />} />
                <Route path="settings" element={<Settings />} />
                <Route path="/preview/:id" element={<Preview />} />
              </Routes>
            </Sidebar>
          }
        />
        <Route path="/authentication" element={<Authentication/>}/>
      </Routes>
    </Router>
  );
}

export default App;
