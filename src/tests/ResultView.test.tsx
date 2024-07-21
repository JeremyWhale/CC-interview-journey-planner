import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResultView from '../views/ResultView';

const mockJourneyData = {
  postcodes: ['Pl26 7AX', 'M3 5EH'],
  journeySegments: [{ time: 30, distance: 10 }],
};

test('renders result view with journey details', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/result', state: mockJourneyData }]}>
      <Routes>
        <Route path="/result" element={<ResultView />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Journey Result/i)).toBeInTheDocument();
  expect(screen.getByText(/Pl26 7AX/i)).toBeInTheDocument();
  expect(screen.getByText(/M3 5EH/i)).toBeInTheDocument();
  expect(screen.getByText('30', { selector: 'td' })).toBeInTheDocument();
  expect(screen.getByText('10.0', { selector: 'td' })).toBeInTheDocument();
});