import { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar, Divider, Chip, Badge, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import type { Notification } from '../types';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (user?.role === 'agent') {
      try {
        const response = await api.get<Notification[]>('/notifications');
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (user?.role === 'agent') {
      fetchNotifications();
      // Polling every 60 seconds for demo purposes
      const interval = setInterval(fetchNotifications, 60000);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
      };
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'rgba(0,0,0,0.05)' : 'transparent',
        transition: 'all 0.3s ease',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', height: scrolled ? 70 : 80, transition: 'height 0.3s ease' }}>
          <Box display="flex" alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', gap: 1.5 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HomeWorkIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-1.5px', color: '#2c3e50', display: { xs: 'none', sm: 'block' } }}>
              THE <span style={{ color: '#f55d4e' }}>PROPERTIST</span>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            {!user ? (
              <>
                <Button component={Link} to="/" sx={{ color: '#2c3e50', fontWeight: 700 }}>HOME</Button>
                <Button component={Link} to="/login" sx={{ color: '#2c3e50', fontWeight: 700 }}>LOGIN</Button>
                <Button component={Link} to="/register" variant="contained" color="primary" sx={{ px: 3 }}>POST PROPERTY FREE</Button>
              </>
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                {user.role === 'agent' && (
                  <>
                    <Tooltip title="Alert Center">
                      <IconButton onClick={(e) => setNotifAnchorEl(e.currentTarget)} sx={{ color: unreadCount > 0 ? 'primary.main' : '#94a3b8' }}>
                        <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: 10 } }}>
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={notifAnchorEl}
                      open={Boolean(notifAnchorEl)}
                      onClose={() => setNotifAnchorEl(null)}
                      PaperProps={{ sx: { mt: 1.5, minWidth: 320, maxWidth: 320, borderRadius: 4, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', overflow: 'hidden' } }}
                    >
                      <Box sx={{ px: 3, py: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Notifications</Typography>
                        {unreadCount > 0 && <Chip label={`${unreadCount} New`} size="small" color="primary" sx={{ height: 20, fontSize: 10, fontWeight: 900 }} />}
                      </Box>
                      <Divider />
                      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <MenuItem 
                              key={notif.id} 
                              onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                              sx={{ 
                                py: 2, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                borderLeft: notif.is_read ? 'none' : '4px solid #f55d4e',
                                bgcolor: notif.is_read ? 'transparent' : 'rgba(245, 93, 78, 0.03)',
                                whiteSpace: 'normal'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: notif.is_read ? 500 : 800, color: notif.is_read ? 'text.secondary' : '#2c3e50', mb: 0.5 }}>
                                {notif.message}
                              </Typography>
                              <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                  {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                                {!notif.is_read && <MarkEmailReadIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.6 }} />}
                              </Box>
                            </MenuItem>
                          ))
                        ) : (
                          <Box sx={{ py: 6, textAlign: 'center' }}>
                             <NotificationsIcon sx={{ fontSize: 40, color: '#f1f5f9', mb: 1 }} />
                             <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 700 }}>Your alert inbox is empty.</Typography>
                          </Box>
                        )}
                      </Box>
                      <Divider />
                      <Box sx={{ p: 1.5, textAlign: 'center' }}>
                         <Button component={Link} to="/dashboard" onClick={() => setNotifAnchorEl(null)} fullWidth size="small" sx={{ fontWeight: 800, borderRadius: 2 }}>
                            VIEW ALL LEADS
                         </Button>
                      </Box>
                    </Menu>

                    <Button
                      component={Link} to="/dashboard"
                      variant="outlined"
                      color="primary"
                      startIcon={<DashboardIcon />}
                      sx={{ fontWeight: 800, border: '2px solid', '&:hover': { border: '2px solid' }, ml: 1, display: { xs: 'none', md: 'flex' } }}
                    >
                      DASHBOARD
                    </Button>
                  </>
                )}
                
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5, border: '2px solid', borderColor: 'primary.light', ml: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, fontWeight: 900 }}>{user.name.charAt(0)}</Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    <Chip label={user.role.toUpperCase()} size="small" sx={{ height: 16, fontSize: 9, fontWeight: 900, ml: 1, bgcolor: '#eee' }} />
                  </Box>
                  <Divider />
                  {user.role === 'agent' && (
                    <MenuItem component={Link} to="/dashboard" onClick={() => setAnchorEl(null)} sx={{ py: 1.5, fontWeight: 600 }}>
                      <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: '#aaa' }} /> My Listings
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, fontWeight: 600, color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
