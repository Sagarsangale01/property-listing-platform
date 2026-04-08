import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, Button, Box, Divider, TextField, Alert, Chip, Table, TableBody, TableCell, TableContainer, TableRow, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LoadingSpinner from '../components/LoadingSpinner';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Property, SubmitEnquiryDTO } from '../types';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [enquiry, setEnquiry] = useState('');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setFetching(true);
        const response = await api.get<Property>(`/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error('Error fetching property', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors: Record<string, string> = {};
    if (!user) {
      if (!guestFirstName.trim()) errors.guestFirstName = 'Required';
      if (!guestLastName.trim()) errors.guestLastName = 'Required';
      if (!guestEmail.trim() || !emailRegex.test(guestEmail)) errors.guestEmail = 'Provide a valid business email';
      
      const cleanPhone = guestPhone.replace(/\s+/g, '').replace('+', '');
      if (!guestPhone.trim()) {
        errors.guestPhone = 'Mobile number is required';
      } else if (!/^\d+$/.test(cleanPhone)) {
        errors.guestPhone = 'Should only contain numbers';
      } else if (cleanPhone.length !== 10) {
        errors.guestPhone = 'Must be exactly 10 digits';
      }
    }
    if (!enquiry.trim()) errors.enquiry = 'Message cannot be empty';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Information required to proceed');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Prioritizing your request...');
    try {
      const payload: SubmitEnquiryDTO = { 
        property_id: id!, 
        message: enquiry,
        guest_first_name: user ? undefined : guestFirstName,
        guest_last_name: user ? undefined : guestLastName,
        guest_email: user ? undefined : guestEmail,
        guest_phone: user ? undefined : guestPhone
      };
      await api.post('/enquiries', payload);
      const successMessage = 'Your executive callback request has been prioritized!';
      setSuccess(successMessage);
      toast.success(successMessage, { id: loadingToast });
      setEnquiry('');
      setGuestFirstName('');
      setGuestLastName('');
      setGuestEmail('');
      setGuestPhone('');
      setError('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to submit request.';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Curating property details..." minHeight="100vh" />;
  if (!property) return <Box p={10} textAlign="center"><Typography>Property not found.</Typography></Box>;

  return (
    <Box sx={{ background: '#f8f9fa', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box mb={6}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
               <Chip label={property.listing_type?.toUpperCase() || 'RESALE'} size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 900, px: 1 }} />
               {property.construction_status === 'Ready To Move In' && (
                 <Chip icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />} label="VERIFIED READY" size="small" color="success" sx={{ fontWeight: 900, px: 1 }} />
               )}
            </Box>
            <Typography variant="h3" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px', mb: 1 }}>
              {property.title}
            </Typography>
            <Box display="flex" alignItems="center" color="text.secondary" gap={0.5}>
               <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
               <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.1rem' }}>{property.location}</Typography>
            </Box>
        </Box>

        <Grid container spacing={5}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Gallery Section */}
            <Paper elevation={0} sx={{ p: 1, borderRadius: 6, border: '1px solid #eee', mb: 6, overflow: 'hidden' }}>
              <Box 
                component="img" 
                src={property.image_url || `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80`} 
                sx={{ width: '100%', height: { xs: 300, md: 500 }, borderRadius: 5, objectFit: 'cover' }} 
              />
            </Paper>

            {/* Core Specifications */}
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#2c3e50' }}>EXECUTIVE SUMMARY</Typography>
            <Grid container spacing={3} mb={6}>
               {[
                 { icon: <BedIcon color="primary" />, label: 'Config', value: `${property.bhk} BHK` },
                 { icon: <SquareFootIcon color="primary" />, label: 'Total Area', value: `${property.area_sqft || 1200} Sq.Ft` },
                 { icon: <BathtubIcon color="primary" />, label: 'Bathrooms', value: property.bathrooms || 2 },
                 { icon: <DirectionsWalkIcon color="primary" />, label: 'Status', value: property.construction_status || 'Ready' }
               ].map((spec, idx) => (
                 <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       {spec.icon}
                       <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, mt: 1, textTransform: 'uppercase' }}>{spec.label}</Typography>
                       <Typography variant="subtitle1" fontWeight={900} sx={{ mt: 0.5 }}>{spec.value}</Typography>
                    </Paper>
                 </Grid>
               ))}
            </Grid>

            {/* Detailed Info Table */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', mb: 6, bgcolor: 'white' }}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Property Type</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2, fontSize: '1.05rem' }}>{property.property_type || 'Luxury Apartment'}</TableCell>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Listing ID</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2, fontSize: '1.05rem', color: 'primary.main' }}>#PRP-00{property.id}</TableCell>
                    </TableRow>
                    <TableRow>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Furnishing</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2 }}>{property.furnishing || 'Semi Furnished'}</TableCell>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Car Parking</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2 }}>1 Covered</TableCell>
                    </TableRow>
                    <TableRow>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Total Floors</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2 }}>G + 14 Floors</TableCell>
                       <TableCell sx={{ border: 'none', color: 'text.secondary', py: 2, fontWeight: 600 }}>Possession</TableCell>
                       <TableCell sx={{ border: 'none', fontWeight: 800, py: 2, color: 'success.main' }}>Immediate</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 4 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                 <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>TOTAL VALUATION</Typography>
                    <Typography variant="h3" fontWeight={950} sx={{ color: '#2c3e50', mt: -0.5 }}>₹{Number(property.price).toLocaleString()}</Typography>
                 </Box>
                 <Chip label="PRICE NEGOTIABLE" sx={{ fontWeight: 900, bgcolor: '#fff0ef', color: 'primary.main', border: '1px solid', borderColor: 'primary.light' }} />
              </Box>
            </Paper>

            {/* Description */}
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#2c3e50' }}>DESCRIPTION</Typography>
            <Typography variant="body1" sx={{ color: '#444', lineHeight: 2, fontSize: '1.1rem', mb: 8, p: 4, bgcolor: 'white', borderRadius: 5, border: '1px solid #eee' }}>
              {property.description || `${property.title} in ${property.location} represents the pinnacle of residential luxury. Featuring a spacious ${property.bhk} BHK layout, this ${property.property_type || 'home'} offers an unmatched urban living experience with premium finishes, excellent ventilation, and proximity to major business hubs.`}
            </Typography>
          </Grid>

          {/* Sidebar Form */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {user?.id !== property.agent_id ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 6, 
                    border: '1px solid #eee', 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                    bgcolor: 'white'
                  }}
                >
                  <Typography variant="h5" fontWeight={900} sx={{ mb: 1, textAlign: 'center', color: '#2c3e50' }}>Book a Private View</Typography>
                  <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>Direct connection to the authorized agent</Typography>
                  
                  {success ? (
                    <Box textAlign="center" py={4}>
                       <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                       <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Success!</Typography>
                       <Typography variant="body2" color="text.secondary">{success}</Typography>
                    </Box>
                  ) : (
                    <form onSubmit={handleSubmitEnquiry} noValidate>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
                        
                        {!user && (
                          <>
                            <Grid container spacing={2}>
                               <Grid size={{ xs: 6 }}>
                                  <TextField 
                                    fullWidth variant="outlined" size="small" label="First Name"
                                    value={guestFirstName} onChange={(e) => {
                                      setGuestFirstName(e.target.value);
                                      if (fieldErrors.guestFirstName) setFieldErrors(prev => ({ ...prev, guestFirstName: '' }));
                                    }}
                                    error={!!fieldErrors.guestFirstName}
                                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                  />
                               </Grid>
                               <Grid size={{ xs: 6 }}>
                                  <TextField 
                                    fullWidth variant="outlined" size="small" label="Last Name"
                                    value={guestLastName} onChange={(e) => {
                                      setGuestLastName(e.target.value);
                                      if (fieldErrors.guestLastName) setFieldErrors(prev => ({ ...prev, guestLastName: '' }));
                                    }}
                                    error={!!fieldErrors.guestLastName}
                                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                  />
                               </Grid>
                            </Grid>
                            <TextField 
                              fullWidth variant="outlined" size="small" type="email" label="Email ID"
                              value={guestEmail} onChange={(e) => {
                                setGuestEmail(e.target.value);
                                if (fieldErrors.guestEmail) setFieldErrors(prev => ({ ...prev, guestEmail: '' }));
                              }}
                              error={!!fieldErrors.guestEmail}
                              helperText={fieldErrors.guestEmail}
                              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <TextField 
                              fullWidth variant="outlined" size="small" label="Mobile Number"
                              value={guestPhone} onChange={(e) => {
                                setGuestPhone(e.target.value);
                                if (fieldErrors.guestPhone) setFieldErrors(prev => ({ ...prev, guestPhone: '' }));
                              }}
                              error={!!fieldErrors.guestPhone}
                              helperText={fieldErrors.guestPhone}
                              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                          </>
                        )}
  
                        <TextField 
                          fullWidth multiline rows={3} label="Your Message"
                          placeholder="e.g. I am interested in visiting this weekend." 
                          variant="outlined" size="small"
                          value={enquiry} onChange={(e) => {
                            setEnquiry(e.target.value);
                            if (fieldErrors.enquiry) setFieldErrors(prev => ({ ...prev, enquiry: '' }));
                          }}
                          error={!!fieldErrors.enquiry}
                          sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
  
                        <Button 
                          type="submit" fullWidth variant="contained" color="primary" 
                          disabled={loading}
                          sx={{ py: 2, fontSize: 16, fontWeight: 900, borderRadius: 3.5, boxShadow: '0 10px 20px rgba(245, 93, 78, 0.25)' }}
                        >
                          {loading ? 'PROCESSING...' : 'GET CONTACT DETAILS'}
                        </Button>
                    </form>
                  )}
  
                  <Box mt={5} pt={4} sx={{ borderTop: '1px solid #eee', textAlign: 'center' }}>
                      <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                         <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 900 }}>{property.agent_name?.charAt(0)}</Avatar>
                         <Box textAlign="left">
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1 }}>{property.agent_name}</Typography>
                            <Typography variant="caption" color="text.secondary">Prime Listing Specialist</Typography>
                         </Box>
                      </Box>
                      <Chip label="RERA VERIFIED" size="small" color="secondary" variant="outlined" sx={{ fontWeight: 900, fontSize: 10 }} />
                  </Box>
                </Paper>
              ) : (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 6, 
                    border: '2px dashed #eee', 
                    textAlign: 'center',
                    bgcolor: 'rgba(248, 249, 250, 0.5)'
                  }}
                >
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#2c3e50', mb: 1 }}>Listing Management</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>This is your property listing. You can view its performance from your dashboard.</Typography>
                  <Button 
                    variant="outlined" color="primary" fullWidth 
                    href="/dashboard"
                    sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}
                  >
                    GO TO DASHBOARD
                  </Button>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetail;
