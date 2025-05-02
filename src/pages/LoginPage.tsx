import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';

const API_URL = 'https://frontend-take-home-service.fetch.com';

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = `Login failed (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response JSON:', jsonError);
        }
        throw new Error(errorMessage);
      }

      console.log("Login successful, navigating to search...");
      navigate('/search');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error('Login error:', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom id="login-heading">
          <PetsIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Dog Matcher Login
        </Typography>
        <Typography component="p" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your name and email to find your paw-fect match!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} aria-labelledby="login-heading">
          <TextField
            label="Name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={handleNameChange}
            disabled={isLoading}
            aria-required="true"
          />
          <TextField
            label="Email Address"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            aria-required="true"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, position: 'relative' }}
            disabled={isLoading || !name || !email}
            aria-busy={isLoading}
          >
            <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>Login</span>
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'inherit',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
