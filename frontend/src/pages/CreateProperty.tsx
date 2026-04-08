import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem, Alert, InputAdornment, Divider, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { CreatePropertyDTO } from '../types';

const CreateProperty = () => {
  const [formData, setFormData] = useState<CreatePropertyDTO>({
    title: '',
    description: '',
    location: '',
    bhk: 2,
    price: 0,
    image_url: '',
    property_type: 'Apartment',
    listing_type: 'Resale',
    construction_status: 'Ready To Move In',
    bathrooms: 2,
    furnishing: 'Semi Furnished',
    area_sqft: 1200
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side Validation logic
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Property headline is mandatory';
    if (!formData.location.trim()) errors.location = 'Specific location is required';
    if (formData.price <= 0) errors.price = 'Please enter a valid property valuation';
    if (formData.bhk <= 0) errors.bhk = 'BHK config must be at least 1';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please refine the highlighted fields');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Publishing your masterpiece...');
    try {
      await api.post('/properties', formData);
      toast.success('Property launched successfully!', { id: loadingToast });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create listing';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ background: '#f8f9fa', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: '1px solid #eee' }}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
             <Avatar sx={{ bgcolor: 'rgba(245, 93, 78, 0.1)', color: 'primary.main', width: 56, height: 56 }}>
                <AddHomeWorkIcon fontSize="large" />
             </Avatar>
             <Box>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px' }}>Launch New Listing</Typography>
                <Typography variant="subtitle2" color="text.secondary">Enter property information to broadcast to potential buyers.</Typography>
             </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>PROPERTY TITLE & HEADLINE</Typography>
                <TextField
                  fullWidth name="title" placeholder="e.g. Luxurious 3BHK Penthouse with Sea View"
                  value={formData.title} onChange={handleChange}
                  error={!!fieldErrors.title}
                  helperText={fieldErrors.title}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>LISTING TYPE</Typography>
                 <TextField
                  fullWidth select name="listing_type"
                  value={formData.listing_type} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="Resale">Resale</MenuItem>
                  <MenuItem value="New">New Project</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>PROPERTY TYPE</Typography>
                 <TextField
                  fullWidth select name="property_type"
                  value={formData.property_type} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Penthouse">Penthouse</MenuItem>
                  <MenuItem value="Studio">Studio</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>TOTAL PRICE (VALUATION)</Typography>
                <TextField
                  fullWidth name="price" type="number"
                  placeholder="Enter value in INR"
                  value={formData.price} onChange={handleChange}
                  error={!!fieldErrors.price}
                  helperText={fieldErrors.price}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>LOCATION / LOCALITY</Typography>
                <TextField
                  fullWidth name="location" placeholder="e.g. Worli, Mumbai"
                  value={formData.location} onChange={handleChange}
                  error={!!fieldErrors.location}
                  helperText={fieldErrors.location}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>BHK CONFIG</Typography>
                <TextField
                  fullWidth name="bhk" type="number"
                  value={formData.bhk} onChange={handleChange}
                  error={!!fieldErrors.bhk}
                  helperText={fieldErrors.bhk}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>BATHROOMS</Typography>
                <TextField
                  fullWidth name="bathrooms" type="number"
                  value={formData.bathrooms} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>SQUARE FEET</Typography>
                <TextField
                  fullWidth name="area_sqft" type="number"
                  value={formData.area_sqft} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>CONSTRUCTION STATUS</Typography>
                 <TextField
                  fullWidth select name="construction_status"
                  value={formData.construction_status} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="Ready To Move In">Ready To Move In</MenuItem>
                  <MenuItem value="Under-Construction">Under-Construction</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>FURNISHING</Typography>
                 <TextField
                  fullWidth select name="furnishing"
                  value={formData.furnishing} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                  <MenuItem value="Semi Furnished">Semi Furnished</MenuItem>
                  <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>PROPERTY DESCRIPTION</Typography>
                <TextField
                  fullWidth multiline rows={4} name="description"
                  placeholder="Tell clients about the unique selling points, amenities, and surroundings..."
                  value={formData.description} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>COVER IMAGE URL</Typography>
                <TextField
                  fullWidth name="image_url" placeholder="Paste a high-quality photo URL (Unsplash/Direct link)"
                  value={formData.image_url} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CloudUploadIcon sx={{ color: '#ccc' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>For professional results, use high-resolution landscape images.</Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button 
                  type="submit" fullWidth variant="contained" color="primary" 
                  disabled={loading}
                  sx={{ py: 2, fontSize: 18, fontWeight: 900, borderRadius: 4, boxShadow: '0 15px 30px rgba(245, 93, 78, 0.3)' }}
                >
                  {loading ? 'LAUNCHING...' : 'PUBLISH LISTING'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateProperty;
