import * as React from 'react';
import { Box, Container, Typography, CssBaseline } from '@mui/material';
import { MainLayout } from './pages';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box m={5} p={2} sx={{ bgcolor: '#eee', height: '100%' }} >
          <Typography variant="subtitle1" gutterBottom style={{ fontWeight: '700'}}>
            Create Order
          </Typography>
          <MainLayout />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
