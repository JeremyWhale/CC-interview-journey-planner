import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartView.css';

const StartView: React.FC = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/journey-entry');
  };

  return (
    <div className="start-view">
      <h2>Welcome to Journey Planner</h2>
      <button className="start-button" aria-label="Start planning" onClick={handleStartJourney}>
        Start Journey
      </button>
    </div>
  );
};

export default StartView;