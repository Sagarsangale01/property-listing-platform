import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  minHeight?: string | number;
}

const LoadingSpinner = ({ message = 'Loading...', minHeight = '50vh' }: LoadingSpinnerProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight 
      }}
    >
      <CircularProgress thickness={4} size={50} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1 }}>
        {message.toUpperCase()}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
