import React, { useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Login from './component/Login';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './component/signup';
import HomePage from './component/HomePage';
import SellingDetail from './component/SellingDetail.jsx'
import { useRecoilValue } from 'recoil';
import userAtom from './atom/userAtom.js';
import WishLIstPage from './component/WishListPage.jsx';
import PropertyDescription from './component/PropertyDescription.jsx';
import PropertyList from './component/Seller';

const useStyles = makeStyles({
  media: {
    height: 200,
  },
  card: {
    cursor: 'pointer',
  },
});

const properties = [
  { id: 1, name: '8 Tampa Heights', location: 'Miami, United States', price: '$1,000,000', bedrooms: 3, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: 2, name: '5 Santa Cruz', location: 'Tenerife, Spain', price: '$700,000', bedrooms: 4, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: 3, name: '10 Holborn Flats', location: 'London', price: '$1,000,000', bedrooms: 3, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: 4, name: '7 West Ave', location: 'Austin, United States', price: '$500,000', bedrooms: 5, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: 5, name: 'Shoreditch House', location: 'London', price: '$1,000,000', bedrooms: 3, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: 6, name: '103 Avenue Apts', location: 'New York, United States', price: '$2,200,000', bedrooms: 4, imageUrl: 'https://via.placeholder.com/300', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
];

const App = () => {
  const classes = useStyles();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleCardClick = (property) => {
    setSelectedProperty(property);
  };

  const handleBackClick = () => {
    setSelectedProperty(null);
  };

  const user = useRecoilValue(userAtom)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/Login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/property/:pid" element={<PropertyDescription />} />
        <Route path="/addProperty" element={user ? <SellingDetail /> : <Navigate to="/Login" />} />
        <Route path="/sellerPage" element={user ? <PropertyList /> : <Navigate to="/Login" />} />
        <Route path="/wishlist" element={user ? <WishLIstPage /> : <Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
