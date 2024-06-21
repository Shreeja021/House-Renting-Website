import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  media: {
    height: 140,
  },
}));

const PropertyCard = ({ property }) => {
  const classes = useStyles();
  const { title, description, address, price, numberOfBedrooms, numberOfBathrooms, area, amenities } = property;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="textSecondary">
          {description}
        </Typography>
        <Typography variant="body2" component="p">
          {address.street}, {address.city}, {address.state}, {address.country} - {address.postalCode}
        </Typography>
        <Typography variant="body2" component="p">
          Price: ${price}
        </Typography>
        <Typography variant="body2" component="p">
          Bedrooms: {numberOfBedrooms}
        </Typography>
        <Typography variant="body2" component="p">
          Bathrooms: {numberOfBathrooms}
        </Typography>
        <Typography variant="body2" component="p">
          Area: {area} sqft
        </Typography>
        <Typography variant="body2" component="p">
          Amenities: {amenities.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
