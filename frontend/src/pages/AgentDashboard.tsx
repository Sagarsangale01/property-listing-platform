import { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Tab, Tabs, Grid, Card, CardContent, Chip, Tooltip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddHomeIcon from '@mui/icons-material/AddHome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Property, Enquiry } from '../types';

const AgentDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propRes, enqRes] = await Promise.all([
        api.get<Property[]>('/properties/my/properties'),
        api.get<Enquiry[]>('/enquiries/agent')
      ]);
      setProperties(propRes.data);
      setEnquiries(enqRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently remove this listing?')) {
      const loadingToast = toast.loading('Removing listing...');
      try {
        await api.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
        toast.success('Listing removed successfully', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to remove listing. Please try again.', { id: loadingToast });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Generating your executive insights..." />;

  // Dynamic values for the stats section
  // Dynamic values for the stats section
  const totalValuation = properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  return (
    <Box sx={{ background: '#f8f9fa', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ color: '#2c3e50', letterSpacing: '-1.5px', mb: 1 }}>Performance Dashboard</Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Welcome back, Agent. Here is your current portfolio snapshot.
            </Typography>
          </Box>
          <Button
            variant="contained" color="primary" component={Link} to="/create-property"
            startIcon={<AddHomeIcon />}
            sx={{ px: 4, py: 1.8, borderRadius: 3, fontWeight: 900, boxShadow: '0 10px 30px rgba(245, 93, 78, 0.25)' }}
          >
            LAUNCH NEW LISTING
          </Button>
        </Box>

        {/* Executive Stats Section */}
        <Grid container spacing={4} mb={8}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', bgcolor: 'white', position: 'relative', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: 'primary.main' }} />
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>Active Listings</Typography>
                  <Typography variant="h2" fontWeight={900} sx={{ color: '#2c3e50', mt: 1 }}>{properties.length}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(245, 93, 78, 0.1)', color: 'primary.main' }}><TrendingUpIcon /></Avatar>
              </Box>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, mt: 2, display: 'block' }}>Total Value: ₹{(totalValuation / 100000).toFixed(2)} Lacs</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', bgcolor: 'white', position: 'relative', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: '#4c84ff' }} />
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>Total Leads</Typography>
                  <Typography variant="h2" fontWeight={900} sx={{ color: '#2c3e50', mt: 1 }}>{enquiries.length}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(76, 132, 255, 0.1)', color: '#4c84ff' }}><PeopleIcon /></Avatar>
              </Box>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, mt: 2, display: 'block' }}>High conversion rate (8.4%)</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', height: '100%', background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Premium Agent Portal</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, mb: 2, textAlign: 'center' }}>You are maximizing your visibility with featured listings status.</Typography>
              <Chip label="PRO STATUS" size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 900, px: 2 }} />
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs and Data Tables */}
        <Box sx={{ borderBottom: '1px solid #eee', mb: 4 }}>
          <Tabs
            value={tab} onChange={(_, val) => setTab(val)}
            sx={{
              '& .MuiTab-root': { fontWeight: 800, fontSize: '1.05rem', px: 4, color: '#94a3b8', textTransform: 'none' },
              '& .Mui-selected': { color: 'primary.main' },
              '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0' }
            }}
          >
            <Tab label={`My Properties (${properties.length})`} />
            <Tab label={`Potential Leads (${enquiries.length})`} />
          </Tabs>
        </Box>

        {tab === 0 ? (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 5, border: '1px solid #eee', bgcolor: 'white' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fbfbfb' }}>
                  <TableCell sx={{ fontWeight: 900, py: 3, px: 4, color: '#64748b' }}>PROPERTY IDENTIFIERS</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#64748b' }}>LOCATION</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#64748b' }}>SPECIFICATIONS</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#64748b' }}>VALUATION</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#64748b' }} align="right">MANAGEMENT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id} sx={{ '&:hover': { bgcolor: '#fcfcfc' }, transition: '0.2s' }}>
                    <TableCell sx={{ fontWeight: 800, py: 3, px: 4, fontSize: '1.05rem' }}>{property.title}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>{property.location}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <Chip label={`${property.bhk} BHK`} size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569', borderRadius: 1.5 }} />
                        <Chip label={`${property.property_type || 'APT'}`} size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569', borderRadius: 1.5 }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.1rem' }}>₹{Number(property.price).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ pr: 4, whiteSpace: 'nowrap' }}>
                      <Box display="flex" justifyContent="flex-end" gap={0.5}>
                        <Tooltip title="Edit Listing"><IconButton component={Link} to={`/edit-property/${property.id}`} color="secondary" size="small" sx={{ border: '1px solid #eee' }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="View Page"><IconButton component={Link} to={`/property/${property.id}`} size="small" sx={{ border: '1px solid #eee', color: '#4c84ff' }}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Remove Listing"><IconButton color="error" size="small" onClick={() => handleDelete(property.id)} sx={{ border: '1px solid #ffebee' }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {properties.length === 0 && (
              <Box p={8} textAlign="center">
                <Typography color="text.secondary" fontWeight={600}>You haven't launched any listings yet.</Typography>
                <Button component={Link} to="/create-property" color="primary" sx={{ mt: 2, fontWeight: 900 }}>Start Your First Portfolio</Button>
              </Box>
            )}
          </TableContainer>
        ) : (
          <Grid container spacing={4}>
            {enquiries.map((enq) => (
              <Grid size={{ xs: 12, md: 6 }} key={enq.id}>
                <Card elevation={0} sx={{ borderRadius: 5, border: '1px solid #eee', transition: '0.3s', '&:hover': { boxShadow: '0 15px 40px rgba(0,0,0,0.06)', transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 2 }}>LEAD FROM </Typography>
                          <Chip
                            label={enq.seeker_id ? "REGISTERED USER" : "GUEST USER"}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              borderRadius: 1,
                              bgcolor: enq.seeker_id ? 'rgba(76, 132, 255, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                              color: enq.seeker_id ? '#4c84ff' : '#64748b',
                              border: 'none'
                            }}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#2c3e50', mt: -0.5 }}>{enq.property_title}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#cbd5e1' }}>{new Date(enq.created_at).toLocaleDateString()}</Typography>
                    </Box>

                    <Grid container spacing={2} mb={3}>
                      <Grid size={{ xs: 12 }}>
                        <Box display="flex" alignItems="center" gap={2} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 900 }}>{(enq.seeker_name || enq.guest_first_name || 'G').charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{enq.seeker_name || `${enq.guest_first_name} ${enq.guest_last_name}`}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 13 }} /> {enq.seeker_email || enq.guest_email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      {(enq.guest_phone || enq.seeker_phone) && (
                        <Grid size={{ xs: 12 }}>
                          <Box display="flex" alignItems="center" gap={1.5} sx={{ px: 2 }}>
                            <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2c3e50', letterSpacing: 0.5 }}>{enq.guest_phone || enq.seeker_phone}</Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Typography variant="body2" sx={{ p: 3, bgcolor: '#fff0ef', borderRadius: 3, color: '#444', fontStyle: 'italic', fontWeight: 600, borderLeft: '4px solid #f55d4e' }}>
                      "{enq.message}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {enquiries.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{ textAlign: 'center', py: 12, borderRadius: 5, border: '1px solid #eee', bgcolor: 'transparent' }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={800}>Awaiting new potential leads.</Typography>
                  <Typography variant="caption" color="text.secondary">Leads appear here automatically when clients inquire about your properties.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AgentDashboard;
