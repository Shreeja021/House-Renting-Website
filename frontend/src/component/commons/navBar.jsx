import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import userAtom from "../../atom/userAtom.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: '#FFFFFF',
    boxShadow: 'none',
    borderBottom: '1px solid #E0E0E0',
  },
  title: {
    flexGrow: 1,
    color: '#C73659',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  navLinks: {
    marginLeft: theme.spacing(2),
    color: '#C73659',
  },
  avatar: {
    backgroundColor: '#C73659',
    cursor: 'pointer',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [user, setUser] = useRecoilState(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);
  const [userName, setUserName] = useState(user && user.firstName);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    await fetch("/api/user/logout");
    setUser(null);
    localStorage.removeItem("user");
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} component={Link} to="/">
          Rentify
        </Typography>
        <div className={classes.root} />
        <Button className={classes.navLinks} onClick={() => navigate("/")}>Home</Button>
        <Button className={classes.navLinks} onClick={() => navigate("/wishlist")}>WishList</Button>
        <Button className={classes.navLinks} onClick={() => navigate("/sellerPage")}>Sell</Button>
        {isLoggedIn ? (
          <>
            <Avatar className={classes.avatar} onClick={handleMenu}>{userName.slice(0, 2)}</Avatar>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button className={classes.navLinks} onClick={() => navigate("/Login")}>Sign In</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
