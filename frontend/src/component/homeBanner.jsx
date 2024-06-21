import React, { useState } from 'react';
import { Typography, Button, Grid, Container, TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from "../data/background.jpg"; // Replace with your image path

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    height: '70vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Added some transparency for better text visibility
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  searchContainer: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust transparency as needed
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%',
    margin: 'auto',
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    width: '100%',
    backgroundColor: "#C73659",
    color: "#fff",
    '&:hover': {
      backgroundColor: '#C73659',
    },
  },
}));

const HomeBanner = ({ setProperties, setIsLoading }) => {
  const classes = useStyles();
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [price, setPrice] = useState('');
  const [amenities, setAmenities] = useState([]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const formData = {
        location, bedrooms, bathrooms, price, amenities
      };
      const res = await fetch("/api/property/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenities = (e) => {
    setAmenities(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
  };

  return (
    <div className={classes.background}>
      <div className={classes.overlay}>
        <Typography variant="h3" gutterBottom>
          Find Your Dream Home
        </Typography>
        <Container className={classes.searchContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="location">Location</InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Location"
                  inputProps={{ name: 'location', id: 'location' }}
                >
                  <MenuItem value=""><em>Select Location</em></MenuItem>
                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                  <MenuItem value="Mumbai">Mumbai</MenuItem>
                  <MenuItem value="Delhi">Delhi</MenuItem>
                  <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                  <MenuItem value="Kerala">Kerala</MenuItem>
                  <MenuItem value="Assam">Assam</MenuItem>
                  <MenuItem value="Goa">Goa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="bedrooms">Bedrooms</InputLabel>
                <Select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  label="Bedrooms"
                  inputProps={{ name: 'bedrooms', id: 'bedrooms' }}
                >
                  <MenuItem value=""><em>Select Bedrooms</em></MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="bathrooms">Bathrooms</InputLabel>
                <Select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  label="Bathrooms"
                  inputProps={{ name: 'bathrooms', id: 'bathrooms' }}
                >
                  <MenuItem value=""><em>Select Bathrooms</em></MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                variant="outlined"
                label="Max Price ($)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={classes.formControl}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="amenities-label">Amenities</InputLabel>
                <Select
                  labelId="amenities-label"
                  id="amenities"
                  multiple
                  value={amenities}
                  onChange={handleAmenities}
                  label="Amenities"
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Schools">Schools</MenuItem>
                  <MenuItem value="Hospitals">Hospitals</MenuItem>
                  <MenuItem value="Shopping Malls">Shopping Malls</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default HomeBanner;
