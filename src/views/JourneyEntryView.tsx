import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JourneyEntryView.css';

interface PostcodeEntry {
  id: number;
  postcode: string;
}

const JourneyEntryView: React.FC = () => {
  const [postcodes, setPostcodes] = useState<PostcodeEntry[]>([]);
  const [currentPostcode, setCurrentPostcode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleCalculateJourney = () => {
    if (postcodes.length < 2) {
      setError('Please enter at least two postcodes');
    } else {
      // TODO: API call for actually calculating
      console.log('Calculating journey for:', postcodes.map(p => p.postcode));
      navigate('/result', { state: { postcodes: postcodes.map(p => p.postcode) } });
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
            {entry.postcode}
            <button onClick={() => handleRemovePostcode(entry.id)}>Remove</button>
            <button onClick={() => handleMovePostcode(index, 'up')} disabled={index === 0}>Up</button>
            <button onClick={() => handleMovePostcode(index, 'down')} disabled={index === postcodes.length - 1}>Down</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCalculateJourney} className="calculate-button">Calculate Journey</button>
    </div>
  );
};

export default JourneyEntryView;