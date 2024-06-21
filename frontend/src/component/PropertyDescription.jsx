import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import userAtom from "../atom/userAtom.js";
import { useRecoilState } from "recoil";
import NavBar from "./commons/navBar.jsx";
import { MdOutlineFavoriteBorder  } from "react-icons/md";


const PropertyDescription = () => {
  const [property, setProperty] = useState(null);
  const [seller, setSeller] = useState(null);
  const { pid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const getProperty = async () => {
      try {
        const res = await fetch(`/api/property/${pid}`);
        const data = await res.json();
        if (data.error) return toast.error(data.error);
        setProperty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProperty();
  }, [pid]);

  const handleWishList = async () => {
    try {
      const res = await fetch(`/api/user/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: property._id,
        }),
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      let newUser = { ...user, wishlist: data.wishlist };
      toast.success(data.message);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleInterested = async () => {
    try {
      const res = await fetch(`/api/user/${property.sellerId}`);
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      setSeller(data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLike = async() => {
    try {
      const res = await fetch(`/api/property/like/${property._id}`)
      const data = await res.json()
      if (data.error) return toast.error(data.error)
      toast.success(data.message)
    setProperty({...property, likes: data.likes})
    } catch (error) {
      console.log(error)
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          placeContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress disableShrink />
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        {property && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {property.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {property.address.city}, {property.address.state}
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardMedia
                    component="img"
                    height="500"
                    image={property.images[0]}
                    alt={property.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        display: 'inline-block',
                        border: "1px solid",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color: "#C73659",
                        mb: 2,
                        marginRight: 4
                      }}
                    >
                      {property.likes.length} {property.likes.length > 1 ? "LIKES" : "LIKE"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        display: 'inline-block',
                        border: "1px solid",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color: "#C73659",
                        mb: 2,
                      }}
                    >
                      {property.numberOfBedrooms} {property.numberOfBedrooms > 1 ? "BEDROOMS" : "BEDROOM"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {property.description}
                    </Typography>
                    <Typography variant="h5" mt={2} mb={1}>
                      Price: <b>₹{property.price}</b>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Address:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {property.address.street}, {property.address.city}, {property.address.state}, {property.address.postalCode}, {property.address.country}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleInterested}
                    disabled={!user}
                    sx={{
                      backgroundColor: "#C73659",
                      "&:hover": {
                        backgroundColor: "#C73659",
                        boxShadow: "none",
                      },
                    }}
                  >
                    I'm interested
                  </Button>
                  <Button
                    disabled={!user}
                    variant="outlined"
                    color="primary"
                    onClick={handleWishList}
                    sx={{
                      color: "#C73659",
                      borderColor: "#C73659",
                      "&:hover": {
                        backgroundColor: "rgba(199, 54, 89, 0.1)",
                        borderColor: "#C73659",
                      },
                    }}
                  >
                    { !user || !user.wishlist.includes(property._id) ? "Add to Wishlist" : "Remove from WishList"}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleLike} disabled={!user}>
                      {user && property.likes.includes(user._id) ? <FavoriteIcon color="error" /> : <MdOutlineFavoriteBorder  />}
                    </IconButton>
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {seller && (
              <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Seller Details</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Name: {seller.firstName + " " + seller.lastName}
                  </DialogContentText>
                  <DialogContentText>
                    Email: {seller.email}
                  </DialogContentText>
                  <DialogContentText>
                    Phone: {seller.phoneNumber}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default PropertyDescription;
