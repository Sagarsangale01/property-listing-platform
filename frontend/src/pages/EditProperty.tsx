import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem, Alert, InputAdornment, Divider, Avatar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import type { UpdatePropertyDTO, Property } from '../types';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<UpdatePropertyDTO>({
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
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get<Property>(`/properties/${id}`);
        const data = response.data;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          bhk: data.bhk || 2,
          price: data.price || 0,
          image_url: data.image_url || '',
          property_type: data.property_type || 'Apartment',
          listing_type: data.listing_type || 'Resale',
          construction_status: data.construction_status || 'Ready To Move In',
          bathrooms: data.bathrooms || 2,
          furnishing: data.furnishing || 'Semi Furnished',
          area_sqft: data.area_sqft || 1200
        });
      } catch (err) {
        setError('Could not retrieve listing details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

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

    const errors: Record<string, string> = {};
    if (!formData.title?.trim()) errors.title = 'Title headline is required';
    if (!formData.location?.trim()) errors.location = 'Location detail is mandatory';
    if ((formData.price || 0) <= 0) errors.price = 'Valuation must be a positive number';
    if ((formData.bhk || 0) <= 0) errors.bhk = 'Bhk config is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix the highlighted values');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Synchronizing updates...');
    try {
      await api.put(`/properties/${id}`, formData);
      toast.success('Listing updated successfully!', { id: loadingToast });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update listing';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Retrieving listing details..." />;

  return (
    <Box sx={{ background: '#f8f9fa', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: '1px solid #eee' }}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
             <Avatar sx={{ bgcolor: 'rgba(76, 132, 255, 0.1)', color: '#4c84ff', width: 56, height: 56 }}>
                <EditNoteIcon fontSize="large" />
             </Avatar>
             <Box>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px' }}>Edit Listing</Typography>
                <Typography variant="subtitle2" color="text.secondary">Update the parameters for ID: #{id}</Typography>
             </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>PROPERTY TITLE & HEADLINE</Typography>
                <TextField
                  fullWidth name="title"
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
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>VALUATION (INR)</Typography>
                <TextField
                  fullWidth name="price" type="number"
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
                  fullWidth name="location"
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
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>DESCRIPTION</Typography>
                <TextField
                  fullWidth multiline rows={4} name="description"
                  value={formData.description} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, ml: 1, color: '#64748b' }}>IMAGE URL</Typography>
                <TextField
                  fullWidth name="image_url"
                  value={formData.image_url} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CloudUploadIcon sx={{ color: '#ccc' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button 
                  type="submit" fullWidth variant="contained" color="secondary" 
                  disabled={loading}
                  sx={{ py: 2, fontSize: 18, fontWeight: 900, borderRadius: 4, boxShadow: '0 15px 30px rgba(44, 62, 80, 0.2)' }}
                >
                  {loading ? 'UPDATING...' : 'SAVE CHANGES'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProperty;
