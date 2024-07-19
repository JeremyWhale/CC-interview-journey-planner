import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import StartView from './views/StartView';
import JourneyEntryView from './views/JourneyEntryView';
import ResultView from './views/ResultView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Journey Planner</h1>
        <Routes>
          <Route path="/" element={<StartView />} />
          <Route path="/journey-entry" element={<JourneyEntryView />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;