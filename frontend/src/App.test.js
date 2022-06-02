import { render, screen } from '@testing-library/react';
import App from './App';

it('renders app', () => {
  render(<App />);
  const appTitle = screen.getByText('MyLists');
  expect(appTitle).toBeInTheDocument();
});
