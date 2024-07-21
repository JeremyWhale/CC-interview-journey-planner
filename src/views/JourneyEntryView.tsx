import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/JourneyEntryView.css';
import { ReactComponent as UpArrow } from '../assets/up-arrow.svg';
import { ReactComponent as DownArrow } from '../assets/down-arrow.svg';
import { calculateJourney } from '../utils/api';

interface PostcodeEntry {
  id: number;
  postcode: string;
}

interface LocationState {
  previousPostcodes?: string[];
}

const JourneyEntryView: React.FC = () => {
  const [postcodes, setPostcodes] = useState<PostcodeEntry[]>([]);
  const [currentPostcode, setCurrentPostcode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state && state.previousPostcodes) {
      setPostcodes(state.previousPostcodes.map((postcode, index) => ({
        id: index,
        postcode: postcode
      })));
    }
  }, [location.state]);

    // This regex validates UK postcodes:
    // - Starts with 1 or 2 letters
    // - Followed by 1 or 2 numbers 
    // - Optionally followed by a letter
    // - Optionally followed by a space
    // - Ends with a number and 2 letters 
  const isValidUKPostcode = (postcode: string) => {
    const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return regex.test(postcode);
  };

  const handleAddPostcode = () => {
    if (isValidUKPostcode(currentPostcode)) {
      setPostcodes([...postcodes, { id: Date.now(), postcode: currentPostcode.toUpperCase() }]);
      setCurrentPostcode('');
      setError('');
    } else {
      setError('Please enter a valid UK postcode');
    }
  };

  const handleRemovePostcode = (id: number) => {
    setPostcodes(postcodes.filter(entry => entry.id !== id));
  };

  const handleMovePostcode = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < postcodes.length - 1)) {
      const newPostcodes = [...postcodes];
      const temp = newPostcodes[index];
      newPostcodes[index] = newPostcodes[index + (direction === 'up' ? -1 : 1)];
      newPostcodes[index + (direction === 'up' ? -1 : 1)] = temp;
      setPostcodes(newPostcodes);
    }
  };

  const handleCalculateJourney = async () => {
    if (postcodes.length < 2) {
      setError('Please enter at least two postcodes');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const journeySegments = await calculateJourney(postcodes.map(p => p.postcode));
      navigate('/result', {
        state: {
          postcodes: postcodes.map(p => p.postcode),
          journeySegments
        }
      });
    } catch (error) {
      setError('An error occurred while calculating the journey. Please check your postcodes and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="journey-entry-view">
      <h2>Enter Your Journey</h2>
      <div className="postcode-input">
        <input
          type="text"
          value={currentPostcode}
          onChange={(e) => setCurrentPostcode(e.target.value)}
          placeholder="Enter UK Postcode"
        />
        <button onClick={handleAddPostcode}>Add</button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="postcode-list">
        {postcodes.map((entry, index) => (
          <li key={entry.id}>
            <span className="postcode">{entry.postcode}</span>
            <div className="button-group">
              <button onClick={() => handleRemovePostcode(entry.id)}>Remove</button>
              <div className="move-button-container">
                <span className="move-label">Up</span>
                <button
                  className="move-button"
                  onClick={() => handleMovePostcode(index, 'up')}
                  disabled={index === 0}
                >
                  <UpArrow />
                </button>
              </div>
              <div className="move-button-container">
                <span className="move-label">Down</span>
                <button
                  className="move-button"
                  onClick={() => handleMovePostcode(index, 'down')}
                  disabled={index === postcodes.length - 1}
                >
                  <DownArrow />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCalculateJourney}
        className="calculate-button"
        disabled={isLoading}
      >
        {isLoading ? 'Calculating...' : 'Calculate Journey'}
      </button>
    </div>
  );
};

export default JourneyEntryView;

