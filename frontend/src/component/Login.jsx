import React, { useState } from 'react'; 
import { useFormik } from 'formik'; 
import * as Yup from 'yup';
import { Container, Box, Typography, Button, TextField, Paper, Avatar, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import userAtom from '../atom/userAtom.js';
import { toast } from 'react-toastify';

const useStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f6f6',
    padding: '20px',
  },
  paper: {
    padding:'40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    margin: '10px',
    backgroundColor: '#C73659',
  },
  form: {
    width: '100%',
    marginTop: '20px',
  },
  submit: {
    marginTop: '20px',
    backgroundColor: '#C73659',
    '&:hover': {
      backgroundColor: '#b82e4e',
    },
  },
  signUpLink: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
};

const Login = () => { 
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({ 
    initialValues: { 
      email: '', 
      password: '' 
    }, 
    validationSchema: Yup.object({ 
      email: Yup.string().email('Invalid email address').required('Required'), 
      password: Yup.string().required('Required') 
    }), 
    onSubmit: async (values, { setSubmitting }) => { 
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.error) {
          return toast.error(data.error);
        }
        setUser(data.user);
        toast.success(data.message);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/');
      } catch (error) {
        console.log('Error:', error);
        toast.error('An error occurred while logging in.');
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }, 
  });

  return ( 
    <Box style={useStyles.container}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} style={useStyles.paper}>
          <Avatar style={useStyles.avatar}>
            <HomeIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login to Your Account
          </Typography>
          <form onSubmit={formik.handleSubmit} style={useStyles.form}>
            <TextField 
              fullWidth 
              margin="normal"
              variant="outlined"
              label="Email" 
              name="email" 
              value={formik.values.email} 
              onChange={formik.handleChange} 
              error={formik.touched.email && Boolean(formik.errors.email)} 
              helperText={formik.touched.email && formik.errors.email} 
            /> 
            <TextField 
              fullWidth 
              margin="normal"
              variant="outlined"
              label="Password" 
              name="password" 
              type="password" 
              value={formik.values.password} 
              onChange={formik.handleChange} 
              error={formik.touched.password && Boolean(formik.errors.password)} 
              helperText={formik.touched.password && formik.errors.password} 
            /> 
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              type="submit" 
              disabled={isLoading}
              style={useStyles.submit}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>
          <Box style={useStyles.signUpLink}>
            <Typography variant="body2">
              Don't have an account? 
              <Button color="primary" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  ); 
}; 
 
export default Login;
