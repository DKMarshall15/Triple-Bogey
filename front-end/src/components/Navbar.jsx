import React, { useState } from "react";
import { Link } from "react-router-dom";
import {AppBar, Toolbar, Typography, Container, Button, Box, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import WeatherWidget from "./WeatherWidget.jsx";

const Navbar = () => {
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
  ];
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
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container>
        {/* <WeatherBanner lat={37.7749} lon={-122.4194} /> */}
        <WeatherWidget />
      </Container>
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
    </>
  );
};

export default Navbar;
