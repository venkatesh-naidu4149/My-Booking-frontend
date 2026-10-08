import { render, screen } from '@testing-library/react';
import App from './App';
test('renders My Booking', () => { render(<App />); expect(screen.getAllByText(/My Booking/i).length).toBeGreaterThan(0); });
