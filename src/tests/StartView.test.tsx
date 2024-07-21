import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import StartView from '../views/StartView';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

test('renders start view and handles button click', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  render(<StartView />);

  const startButton = screen.getByText(/Start Journey/i);
  expect(startButton).toBeInTheDocument();

  fireEvent.click(startButton);
  expect(mockNavigate).toHaveBeenCalledWith('/journey-entry');
});