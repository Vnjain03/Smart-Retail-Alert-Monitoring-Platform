import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.login({ email, password });

      // Only navigate if we successfully got a token
      if (response?.access_token) {
        localStorage.setItem('access_token', response.access_token);
        navigate('/dashboard');
      } else {
        setError('Login failed: No access token received');
      }
    } catch (err: any) {
      
      // Enhanced error handling to display proper error messages
      console.error('Login error:', err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = err.response.data?.detail ||
                            err.response.data?.message ||
                            `Login failed: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Cannot connect to server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Login failed: ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Smart Retail Monitoring
          </Typography>
          <Typography variant="h6" align="center" gutterBottom color="textSecondary">
            Login
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
export default Login;
