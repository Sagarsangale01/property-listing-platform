import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetail from './pages/PropertyDetail';
import AgentDashboard from './pages/AgentDashboard';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                
                {/* Agent Only Routes */}
                <Route element={<ProtectedRoute role="agent" />}>
                  <Route path="/dashboard" element={<AgentDashboard />} />
                  <Route path="/create-property" element={<CreateProperty />} />
                  <Route path="/edit-property/:id" element={<EditProperty />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
