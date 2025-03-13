import { CircularProgress, Box } from '@mui/material';
import React from 'react';

/**
 *
 * Loader to cover the whole page.
 * Specifically can use for lazy loading
 */
const Loader = ({ height, ...props }: { height?: string }) => (
  <Box
    alignItems="center"
    display="flex"
    height={height}
    justifyContent="center"
    {...props}
  >
    <CircularProgress data-testid="loader"/>
  </Box>
);

Loader.defaultProps = {
  height: '100vh',
};

export default Loader;
