import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders main app component', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Journey Planner/i, level: 1 });
  expect(headerElement).toBeInTheDocument();
});