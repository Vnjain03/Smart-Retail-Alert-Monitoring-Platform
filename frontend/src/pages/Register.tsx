import React, { useState } from 'react';

import {

  Container,

  Paper,

  TextField,

  Button,

  Typography,

  Box,

  Alert,

  Link as MuiLink,

} from '@mui/material';

import { useNavigate, Link } from 'react-router-dom';

import { authAPI } from '../services/api';

 

const Register: React.FC = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullName, setFullName] = useState('');

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    setSuccess('');

 

    // Validate passwords match

    if (password !== confirmPassword) {

      setError('Passwords do not match');

      return;

    }

 

    // Validate password strength

    if (password.length < 6) {

      setError('Password must be at least 6 characters long');

      return;

    }

 

    try {

      await authAPI.register({

        email,

        password,

        full_name: fullName,

        role: 'user'

      });

 

      setSuccess('Registration successful! Redirecting to login...');

 

      // Redirect to login after 2 seconds

      setTimeout(() => {

        navigate('/login');

      }, 2000);

    } catch (err: any) {

      console.error('Registration error:', err);

 

      if (err.response) {

        const errorMessage = err.response.data?.detail ||

                            err.response.data?.message ||

                            `Registration failed: ${err.response.status}`;

        setError(errorMessage);

      } else if (err.request) {

        setError('Cannot connect to server. Please check your connection.');

      } else {

        setError('Registration failed: ' + (err.message || 'Unknown error'));

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

            Create Account

          </Typography>

 

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

 

          <form onSubmit={handleSubmit}>

            <TextField

              fullWidth

              label="Full Name"

              type="text"

              value={fullName}

              onChange={(e) => setFullName(e.target.value)}

              margin="normal"

              required

              autoFocus

            />

            <TextField

              fullWidth

              label="Email"

              type="email"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              margin="normal"

              required

            />

            <TextField

              fullWidth

              label="Password"

              type="password"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              margin="normal"

              required

              helperText="Minimum 6 characters"

            />

            <TextField

              fullWidth

              label="Confirm Password"

              type="password"

              value={confirmPassword}

              onChange={(e) => setConfirmPassword(e.target.value)}

              margin="normal"

              required

            />

            <Button

              fullWidth

              variant="contained"

              type="submit"

              sx={{ mt: 3 }}

            >

              Register

            </Button>

          </form>

 

          <Box sx={{ mt: 2, textAlign: 'center' }}>

            <Typography variant="body2">

              Already have an account?{' '}

              <MuiLink component={Link} to="/login" underline="hover">

                Login here

              </MuiLink>

            </Typography>

          </Box>

        </Paper>

      </Box>

    </Container>

  );

};

 

export default Register;
