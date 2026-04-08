import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Avatar, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const errors: Record<string, string> = {};
    if (!email.trim() || !emailRegex.test(email)) errors.email = 'Please provide a valid business email';
    if (!password) errors.password = 'Security clearance required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Authentication requirements not met');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Authorizing credentials...');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Access Granted. Welcome back.', { id: loadingToast });
      navigate(response.data.user.role === 'agent' ? '/dashboard' : '/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 6, border: '1px solid #eee', textAlign: 'center', bgcolor: 'white' }}>
          <Box display="flex" justifyContent="center" mb={3}>
             <Avatar sx={{ bgcolor: 'rgba(245, 93, 78, 0.1)', color: 'primary.main', width: 64, height: 64 }}>
                <LockOutlinedIcon fontSize="large" />
             </Avatar>
          </Box>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px', mb: 1 }}>Authenticate</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 4 }}>Access your premium real estate dashboard</Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Box mb={2} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>SECURITY EMAIL</Typography>
               <TextField
                fullWidth variant="outlined" type="email"
                placeholder="name@company.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box mb={4} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>ACCESS KEY</Typography>
               <TextField
                fullWidth variant="outlined" type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>

            <Button
              type="submit" fullWidth variant="contained" color="primary"
              disabled={loading}
              sx={{ py: 1.8, fontSize: 16, fontWeight: 900, borderRadius: 4, boxShadow: '0 10px 25px rgba(245, 93, 78, 0.2)' }}
            >
              {loading ? 'AUTHORIZING...' : 'SECURE LOGIN'}
            </Button>
          </form>

          <Box mt={4}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              New to the platform? <MuiLink component={Link} to="/register" sx={{ fontWeight: 800, color: 'secondary.main', textDecoration: 'none' }}>Initialize Account</MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
