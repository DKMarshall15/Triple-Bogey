import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { userLogin } from "./utilities";
import { useNavigate } from "react-router-dom";
import bgimg from "../assets/images/beach.jpg";

const LogInPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const { contextObj } = useOutletContext();
  const { setUser } = contextObj;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form data:", form);
    // Add API call here
    userLogin(form.email, form.password)
      .then((user) => {
        if (user) {
          setUser(user);
          navigate("/courses");
        } else {
          console.error("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h5" align="center">
            Login
          </Typography>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
          <Typography align="center" variant="body2">
            Don't have an account?{" "}
            <Link
              onClick={() => navigate("/signup")}
              sx={{ cursor: "pointer" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LogInPage;
