import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Traffic Jam logo', () => {
  render(<App />);
  const logo = screen.getByText(/traffic jam/i);
  expect(logo).toBeInTheDocument();
});
