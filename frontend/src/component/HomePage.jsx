import React, { useEffect, useState } from 'react';
import { Typography, Button, Grid, Container, Card, CardContent, CardMedia, CardActions, Divider, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import NavBar from './commons/navBar';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atom/userAtom.js';
import HomeBanner from './homeBanner.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    border: '1px solid #ddd',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
    backgroundSize: 'cover',
  },
  cardContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  wishlistIcon: {
    color: '#C73659',
    cursor: 'pointer',
  },
  bedroomsCount: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
  },
  priceTag: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  contactButton: {
    width: '100%',
    backgroundColor: '#C73659',
    color: 'white',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#b0294b',
    },
  },
  progress: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  noResults: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const HomePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProperties = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/property");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProperties();
  }, []);

  const toggleWishlist = async (propertyId) => {
    if (!user) return navigate("/Login");
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: propertyId }),
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      toast.success(data.message);
      const newUser = { ...user, wishlist: data.wishlist };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <NavBar />
      <HomeBanner setProperties={setProperties} setIsLoading={setIsLoading} />
      <Container sx={{ textAlign: 'center', py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h2" component="div" style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '10px' }}>
            <strong>Properties</strong>
          </Typography>
        </Box>
        <div style={{ width: '100%', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider style={{ width: '100px', borderBottomWidth: 3, borderBottomColor: 'orange', margin: 'auto' }} />
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px', marginBottom: '60px', fontSize: '26px' }}>
            We provide our clients with the best real estate deals. <br />Browse some of our featured & hot properties below or browse <br /> our website for more offers.
          </Typography>
        </div>
      </Container>
      {isLoading ? (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      ) : (
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {properties.length > 0 ? (
              properties.map((property) => (
                (<Grid item key={property._id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={property.images[0] || 'default-image.jpg'} // Fallback image if no images are available
                      title={property.title}
                    >
                      <Typography variant="body2" className={classes.bedroomsCount}>
                        {property.numberOfBedrooms} {property.numberOfBedrooms > 1 ? 'BEDROOMS' : 'BEDROOM'}
                      </Typography>
                    </CardMedia>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {property.title}
                      </Typography>
                      <Typography>
                        {property.address.city}, {property.address.state}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Typography className={classes.priceTag}>
                        ${property.price}
                      </Typography>
                      <Typography>
                        Likes: {property.likes.length}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <Button
                        size="small"
                        variant="contained"
                        className={classes.contactButton}
                        onClick={() => navigate(`/property/${property._id}`)}
                      >
                        VIEW DETAILS
                      </Button>
                      <div className={classes.wishlistIcon}>
                        {user && user.wishlist.includes(property._id) ? (
                          <FavoriteIcon onClick={() => toggleWishlist(property._id)} />
                        ) : (
                          <FavoriteBorderIcon onClick={() => toggleWishlist(property._id)} />
                        )}
                      </div>
                    </CardActions>
                  </Card>
                </Grid>)
              ))
            ) : (
              <div className={classes.noResults}>No search results</div>
            )}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default HomePage;
