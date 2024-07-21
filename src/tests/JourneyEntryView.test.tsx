import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JourneyEntryView from '../views/JourneyEntryView';
import { calculateJourney } from '../utils/api';

jest.mock('../utils/api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockedCalculateJourney = calculateJourney as jest.MockedFunction<typeof calculateJourney>;

test('renders journey entry view and handles postcode input', async () => {
  mockedCalculateJourney.mockResolvedValue([{ time: 30, distance: 10 }]);

  render(
    <BrowserRouter>
      <JourneyEntryView />
    </BrowserRouter>
  );

  const input = screen.getByPlaceholderText(/Enter UK Postcode/i);
  const addButton = screen.getByText(/Add/i);

  fireEvent.change(input, { target: { value: 'Pl26 7AX' } });
  fireEvent.click(addButton);

  fireEvent.change(input, { target: { value: 'M3 5EH' } });
  fireEvent.click(addButton);

  const calculateButton = screen.getByText(/Calculate Journey/i);
  fireEvent.click(calculateButton);

  await waitFor(() => {
    expect(mockedCalculateJourney).toHaveBeenCalled();
  });
});