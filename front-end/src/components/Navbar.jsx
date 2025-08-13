import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { userLogOut } from "../pages/utilities";
// import WeatherWidget from "./WeatherWidget.jsx";

const Navbar = ({ user, setUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerLinks = [
    { text: "Courses", link: "/courses" },
    { text: "Favorites", link: "/favorites" },
    { text: "Scorecards", link: "/scorecards" },
    { text: "Signup", link: "/signup" },
    { text: "Login", link: "/login" },
  ];
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const isLoggedIn = !!user; // Check if user exists
  console.log("User in Navbar:", user);

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Container>
          <Toolbar>
            <img
              src="./src/assets/images/logo2.png"
              alt="Triple Bogey Logo"
              style={{ height: 40, marginRight: 8 }}
            />
            <Typography
              color="inherit"
              variant="h4"
              sx={{ flexGrow: 1, fontFamily: "Bangers, cursive" }}
            >
              Triple Bogey
            </Typography>
            {isMobile && (
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuOpenIcon />
              </IconButton>
            )}
            {!isMobile && (
              <>
                <Button component={Link} to="/courses" color="inherit">
                  Courses
                </Button>
                <Button component={Link} to="/favorites" color="inherit">
                  Favorites
                </Button>
                <Button component={Link} to="/scorecards" color="inherit">
                  Scorecards
                </Button>
                <IconButton color="inherit" onClick={handleAccountMenuOpen}>
                  <AccountCircleIcon />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ marginLeft: 2, color: "white" }}
                >
                  {isLoggedIn ? `Welcome, ${user.display_name || user.username}` : "Guest"}
                </Typography>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* <Container>
        <WeatherWidget />
      </Container> */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 320 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {drawerLinks.map((linkItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={linkItem.link}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={linkItem.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Account Popup Menu */}
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={handleAccountMenuClose}
      >
        {isLoggedIn ? (
          <MenuItem onClick={handleAccountMenuClose}>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                await userLogOut();
                setUser(null); // Clear user state on logout
                handleAccountMenuClose();
              }}
            >
              Logout
            </Button>
          </MenuItem>
        ) : (
          <MenuItem
            sx={{ display: "flex", flexDirection: "column" }}
            onClick={handleAccountMenuClose}
          >
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Signup
            </Link>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Navbar;
