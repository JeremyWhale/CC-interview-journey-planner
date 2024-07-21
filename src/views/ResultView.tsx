import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ResultView.css';
import { JourneySegment } from '../utils/api';

interface LocationState {
  postcodes: string[];
  journeySegments: JourneySegment[];
}

const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { postcodes, journeySegments } = location.state as LocationState;

  const totalTime = journeySegments.reduce((sum, segment) => sum + segment.time, 0);
  const totalDistance = journeySegments.reduce((sum, segment) => sum + segment.distance, 0);

  const handleStartOver = () => {
    navigate('/journey-entry', { state: { previousPostcodes: postcodes } });
  };

  return (
    <div className="result-view">
      <h2>Journey Result</h2>
      <table className="journey-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Time (minutes)</th>
            <th>Distance (miles)</th>
          </tr>
        </thead>
        <tbody>
          {journeySegments.map((segment, index) => (
            <tr key={index}>
              <td>{postcodes[index]}</td>
              <td>{postcodes[index + 1]}</td>
              <td>{segment.time}</td>
              <td>{segment.distance.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="journey-summary">
        <p>Total Travel Time: {totalTime} minutes</p>
        <p>Total Travel Distance: {totalDistance.toFixed(1)} miles</p>
      </div>
      <button onClick={handleStartOver} className="start-over-button">Start Over</button>
    </div>
  );
};

export default ResultView;