import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, Box, CardMedia, Chip, Paper, Slider, IconButton, Link as MuiLink, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StraightenIcon from '@mui/icons-material/Straighten';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import BathtubIcon from '@mui/icons-material/Bathtub';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChairIcon from '@mui/icons-material/Chair';
import type { Property } from '../types';

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState('');
  const [bhk, setBhk] = useState('');
  const [budget, setBudget] = useState<number[]>([500000, 200000000]);
  const [constructionStatus, setConstructionStatus] = useState('');
  const [listingType, setListingType] = useState('Resale');
  const [propertyType, setPropertyType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (location) queryParams.append('location', location);
      if (bhk) queryParams.append('bhk', bhk);
      if (budget[0]) queryParams.append('minPrice', budget[0].toString());
      if (budget[1]) queryParams.append('maxPrice', budget[1].toString());
      if (constructionStatus) queryParams.append('construction_status', constructionStatus);
      if (listingType) queryParams.append('listing_type', listingType);
      if (propertyType) queryParams.append('property_type', propertyType);

      const response = await api.get<Property[]>(`/properties?${queryParams.toString()}`);
      setProperties(response.data);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [location, bhk, budget, constructionStatus, listingType, propertyType]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
    return `₹ ${price.toLocaleString()}`;
  }

  const formatLabel = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000)}Cr`;
    if (val >= 100000) return `${(val / 100000)}L`;
    return val.toLocaleString();
  }

  return (
    <Box sx={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Search Header Bar */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', py: 2, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden', p: '4px 8px', transition: '0.3s', '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 4px rgba(245, 93, 78, 0.1)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, borderRight: '1px solid #f1f5f9' }}>
              <LocationOnIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#475569' }}>INDIA</Typography>
            </Box>
            <TextField
              sx={{ flex: 1, '& .MuiInputBase-root': { px: 2, fontSize: 15, fontWeight: 600, color: '#1e293b' } }}
              fullWidth variant="standard" placeholder="Search by locality, project or landmark..."
              value={location} onChange={(e) => setLocation(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
            <Button variant="contained" color="primary" sx={{ minWidth: 50, height: 50, borderRadius: 3 }} onClick={fetchProperties}>
              <SearchIcon />
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box mb={6}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', mb: 1.5 }}>
            The <span style={{ color: '#f55d4e' }}>Exclusive</span> Collection
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Discover high-valuation residential properties across prime localities.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar Filter */}
          <Grid size={{ xs: 12, md: 3.2 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', position: 'sticky', top: 120, bgcolor: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, letterSpacing: -0.5 }}>Search Intelligence</Typography>

              <Box mb={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>I'm Looking For</Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    label="Property" variant="outlined"
                    onClick={() => setListingType('Resale')}
                    sx={{ flex: 1, borderRadius: 2, fontWeight: 800, bgcolor: listingType === 'Resale' ? '#fff0ef' : 'transparent', borderColor: listingType === 'Resale' ? 'primary.main' : '#e2e8f0', color: listingType === 'Resale' ? 'primary.main' : '#64748b' }}
                  />
                  <Chip
                    label="New Project" variant="outlined"
                    onClick={() => setListingType('New')}
                    sx={{ flex: 1, borderRadius: 2, fontWeight: 800, bgcolor: listingType === 'New' ? '#fff0ef' : 'transparent', borderColor: listingType === 'New' ? 'primary.main' : '#e2e8f0', color: listingType === 'New' ? 'primary.main' : '#64748b' }}
                  />
                </Box>
              </Box>

              <Box mb={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>BHK Config</Typography>
                <Grid container spacing={1}>
                  {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map((val) => (
                    <Grid size={{ xs: 4 }} key={val}>
                      <Chip
                        label={val.split(' ')[0]}
                        onClick={() => setBhk(val.split(' ')[0])}
                        variant={bhk === val.split(' ')[0] ? 'filled' : 'outlined'}
                        color={bhk === val.split(' ')[0] ? 'primary' : 'default'}
                        sx={{ width: '100%', fontSize: 12, fontWeight: 900, borderRadius: 2 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box mb={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>Budget (INR)</Typography>
                <Slider
                  value={budget} min={500000} max={200000000} step={500000}
                  onChange={(_, val) => setBudget(val as number[])}
                  color="primary" valueLabelDisplay="auto"
                  valueLabelFormat={formatLabel}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569' }}>5 L</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569' }}>20 Cr</Typography>
                </Box>
              </Box>

              <Box mb={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>Construction Status</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {['Ready To Move In', 'Under-Construction'].map(status => (
                    <Chip
                      key={status} label={status}
                      variant={constructionStatus === status ? 'filled' : 'outlined'}
                      color={constructionStatus === status ? 'primary' : 'default'}
                      onClick={() => setConstructionStatus(constructionStatus === status ? '' : status)}
                      sx={{ borderRadius: 2, fontSize: 11, fontWeight: 800, px: 1 }}
                    />
                  ))}
                </Box>
              </Box>

              <Button
                fullWidth variant="text" color="primary"
                onClick={() => { setLocation(''); setBhk(''); setBudget([500000, 200000000]); setConstructionStatus(''); setListingType('Resale'); setPropertyType(''); }}
                sx={{ fontWeight: 900, mt: 2 }}
              >
                CLEAR ALL FILTERS
              </Button>
            </Paper>
          </Grid>

          {/* Results List (Executive Cards) */}
          <Grid size={{ xs: 12, md: 8.8 }}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Showing {properties.length} Listings</Typography>
              {loading && <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>SYNCHRONIZING...</Typography>}
            </Box>

            <Box display="flex" flexDirection="column" gap={4}>
              {loading && properties.length === 0 && [1, 2, 3].map(i => (
                <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
              ))}

              {properties.map((property) => (
                <Card key={property.id} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 5, border: '1px solid #eee', position: 'relative', transition: '0.3s', '&:hover': { boxShadow: '0 20px 40px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', sm: 340 }, height: 280, objectFit: 'cover' }}
                    image={property.image_url || `https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80`}
                    alt={property.title}
                  />
                  <CardContent sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1.35rem' }}>{property.bhk} BHK {property.property_type || 'Apartment'}</Typography>
                          <Chip label={`${property.listing_type} PROPERTY`} size="small" sx={{ bgcolor: 'rgba(76, 132, 255, 0.1)', color: '#4c84ff', fontWeight: 900, fontSize: 9, borderRadius: 1.5 }} />
                        </Box>
                        <Box display="flex" alignItems="center" color="#64748b">
                          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#94a3b8' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{property.location}</Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" sx={{ border: '1px solid #f1f5f9' }}><FavoriteBorderIcon sx={{ fontSize: 20 }} /></IconButton>
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                      <Grid size={{ xs: 4 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box sx={{ p: 1, border: '1px solid #f1f5f9', borderRadius: 2 }}><ChairIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Furnishing</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: 13, mt: -0.5 }}>{property.furnishing || 'Semi'}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box sx={{ p: 1, border: '1px solid #f1f5f9', borderRadius: 2 }}><StraightenIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Build Area</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: 13, mt: -0.5 }}>{property.area_sqft || 1200} SqFt</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box sx={{ p: 1, border: '1px solid #f1f5f9', borderRadius: 2 }}><BathtubIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Bathrooms</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: 13, mt: -0.5 }}>{property.bathrooms || 2}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box mt="auto" display="flex" justifyContent="space-between" alignItems="flex-end">
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8' }}>TOTAL VALUATION</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 950, color: '#1e293b' }}>{formatPrice(property.price)}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <MuiLink component={Link} to={`/property/${property.id}`} sx={{ display: 'flex', alignItems: 'center', fontWeight: 900, color: 'primary.main', textDecoration: 'none', fontSize: 14 }}>
                          EXPLORE PROPERTY <ArrowRightAltIcon sx={{ ml: 0.5 }} />
                        </MuiLink>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {!loading && properties.length === 0 && (
                <Paper elevation={0} sx={{ textAlign: 'center', py: 15, borderRadius: 5, border: '1px solid #eee' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>No Matches Found</Typography>
                  <Typography variant="body2" color="text.secondary">Try adjusting your filters to find your ideal property.</Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
