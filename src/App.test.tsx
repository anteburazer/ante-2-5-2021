import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "XBT/USD Orderbook" title', () => {
  render(<App />);
  const titleElement = screen.getByText(/XBT\/USD Orderbook/i);
  expect(titleElement).toBeInTheDocument();
});
