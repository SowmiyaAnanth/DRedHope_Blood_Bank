import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

it('Should show the loader', () => {
  render(<Loader />);
  expect(screen.getByTestId('loader')).toBeInTheDocument();
});
