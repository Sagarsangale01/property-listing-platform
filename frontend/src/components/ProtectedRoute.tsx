import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  role?: 'agent' | 'seeker';
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
