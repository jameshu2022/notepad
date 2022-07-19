import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import HomeIcon from "@mui/icons-material/Home";

import { useAuth } from "../Auth.js";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";

import { Link as RouterLink } from "react-router-dom";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [busy, setBusy] = React.useState(true);

  const auth = useAuth();

  const [cookies] = useCookies(["TOKEN_PAYLOAD"]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendToLogin = () => {
    
  }

  const handleLogout = () => {
    var url = "/api/users/logout";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method : "POST"
    }
    handleClose();
    fetch(url, requestOptions)
      .then()
      .catch(err => console.log(err));
    window.location.reload();
    
    auth.logout()
      .then(() => {
        localStorage.removeItem("userid");
      });
    
  }

  React.useEffect(() => {
    if(auth.authed){
      setUsername(jwt_decode(cookies.TOKEN_PAYLOAD).username);
      setBusy(false);
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            href="/"
          >
            {/* <MenuIcon /> */}
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {!busy && ((auth.authed ? (username + "'s Notepad") : "Blank Notepad"))} 
          </Typography>
          {auth.authed && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
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
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link
                    color="inherit"
                    component={RouterLink}
                    to="/profile"
                    sx={{ textDecoration : "none" }}
                  >
                  <MenuItem onClick={handleClose}>
                    
                      My account
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          )}

            {!auth.authed && (
                <div>
                    <Button
                        onClick={sendToLogin}
                        color="inherit"
                        variant="outlined"
                        href="/login"
                    >
                        Login
                    </Button>
                </div>
            )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
