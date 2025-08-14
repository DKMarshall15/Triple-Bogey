import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import logo from "../assets/images/logo2.png";
import bgimg from "../assets/images/putting.jpg";

function HomePage() {
  const { contextObj } = useOutletContext();
  const { user, setUser } = contextObj;
  const isLoggedIn = !!user; // Same check as in Navbar

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          borderRadius: 3,
          py: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <img src={logo} alt="Logo" style={{ width: 120, height: 120 }} />
          </Box>

          <Box
            sx={{
              mx: { xs: 0, md: 2 },
              px: { xs: 2, md: 0 },
              textAlign: "center",
              flex: { xs: "none", md: "0 1 auto" },
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
                mb: 1,
                fontWeight: "bold",
                color: "primary.main", // Changed from secondary to primary for better contrast
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Welcome to Triple Bogey
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem" },
                color: "text.primary", // Better contrast
                fontWeight: "normal",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Your ultimate golf companion*
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <img src={logo} alt="Logo" style={{ width: 120, height: 120 }} />
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2, fontSize: '1.1rem' }}>
            Start exploring courses now!
          </Typography>
          <Button component={Link} to="/courses" variant="contained" size="large" color="primary">
            View Courses
          </Button>
          
          {isLoggedIn ? (
            <>
              <Typography variant="body1" color="text.primary" sx={{ my: 2, fontSize: '1rem' }}>
                Manage your golf experience!
              </Typography>
              <Button component={Link} to="/favorites" variant="contained" size="large" color="primary" sx={{ ml: 2 }}>
                Favorites
              </Button>
              <Button component={Link} to="/scorecards" variant="outlined" size="large" color="primary" sx={{ ml: 2 }}>
                Scorecards
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" color="text.primary" sx={{ my: 2, fontSize: '1rem' }}>
                Login or sign up to save your favorites and track your progress!
              </Typography>
              <Button component={Link} to="/login" variant="contained" size="large" color="primary" sx={{ ml: 2 }}>
                Login
              </Button>
              <Button component={Link} to="/signup" variant="outlined" size="large" color="primary" sx={{ ml: 2 }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            *I mean it's a work in progress...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
