import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, MenuItem, Avatar, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'seeker' | 'agent'>('seeker');
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
    if (!name.trim()) errors.name = 'Full legal name is required';
    if (!email.trim() || !emailRegex.test(email)) errors.email = 'Please provide a valid business email';
    
    // Detailed Mobile Validation
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    if (!phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!/^\d+$/.test(cleanPhone)) {
      errors.phone = 'Should only contain numbers';
    } else if (cleanPhone.length !== 10) {
      errors.phone = 'Must be exactly 10 digits';
    }

    if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please complete the registration requirements');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Initializing profile...');
    try {
      const response = await api.post('/auth/register', { name, email, password, phone, role });
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!', { id: loadingToast });
      navigate(role === 'agent' ? '/dashboard' : '/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', py: 8 }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 6, border: '1px solid #eee', textAlign: 'center', bgcolor: 'white' }}>
          <Box display="flex" justifyContent="center" mb={3}>
             <Avatar sx={{ bgcolor: 'rgba(76, 132, 255, 0.1)', color: '#4c84ff', width: 64, height: 64 }}>
                <AssignmentIndIcon fontSize="large" />
             </Avatar>
          </Box>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px', mb: 1 }}>Initialize Account</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 4 }}>Begin your premium real estate journey</Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Box mb={2} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>FULL LEGAL NAME</Typography>
               <TextField
                fullWidth variant="outlined"
                placeholder="e.g. John Doe"
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                }}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box mb={2} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>EMAIL ADDRESS</Typography>
               <TextField
                fullWidth variant="outlined" type="email"
                placeholder="e.g. name@company.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box mb={2} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>MOBILE NUMBER</Typography>
               <TextField
                fullWidth variant="outlined"
                placeholder="e.g. +91 99999 99999"
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
                }}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box mb={2} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>ACCOUNT PROFILE TYPE</Typography>
               <TextField
                fullWidth select variant="outlined" required
                value={role} onChange={(e) => setRole(e.target.value as 'seeker' | 'agent')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <MenuItem value="seeker">I want to Buyer/Rent Properties</MenuItem>
                <MenuItem value="agent">I am an Agent / Property Owner</MenuItem>
              </TextField>
            </Box>
            <Box mb={4} textAlign="left">
               <Typography variant="caption" sx={{ fontWeight: 800, ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>SECURE PASSWORD</Typography>
               <TextField
                fullWidth variant="outlined" type="password"
                placeholder="Create a strong password"
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
              type="submit" fullWidth variant="contained" color="secondary"
              disabled={loading}
              sx={{ py: 1.8, fontSize: 16, fontWeight: 900, borderRadius: 4, boxShadow: '0 10px 25px rgba(44, 62, 80, 0.2)' }}
            >
              {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <Box mt={4}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Already have an account? <MuiLink component={Link} to="/login" sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none' }}>Authorize Session</MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
