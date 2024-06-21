import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import userAtom from '../atom/userAtom.js';
import { toast } from 'react-toastify';
import NavBar from './commons/navBar.jsx';

const PropertyList = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/property/user`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('An error occurred while fetching properties.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProperties();
    }
  }, [user]);

  return (
    <>
        <NavBar />
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4" gutterBottom>
          My Properties
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {properties.length === 0 ? (
            <Typography variant="body1">You have not uploaded any properties yet.</Typography>
          ) : (
            properties.map(property => (
              <Grid key={property._id} item xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.images[0]} // Assuming images array contains URLs of property images
                    alt={property.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {property.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      {property.address.city}, {property.address.state}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ₹{property.price}
                    </Typography>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Box mt={2}>
                        <Button variant="outlined" color="primary" onClick={() => navigate(`/property/${property._id}`)}>
                          View Details
                        </Button>
                      </Box>
                      <Box mt={2}>
                        <Button variant="outlined" color="primary" onClick={() => navigate(`/property/${property._id}`)}>
                          Edit
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => navigate("/addProperty")}>
          Add Property
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default PropertyList;
