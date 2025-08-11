import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useOutletContext } from "react-router-dom";
import { userLogin, userSignUp } from "./utilities";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ display_name: "", email: "", password: "" });
  const { contextObj } = useOutletContext();
  const { setUser } = contextObj;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup form data:", form);
    // Add API call here
    userSignUp(form.display_name, form.email, form.password)
      .then((user) => {
        if (user) {
          setUser(user);
          userLogin(form.email, form.password)
            .then(() => {
              navigate("/courses");
            })
            .catch((error) => {
              console.error("Error during login after signup:", error);
            });
        } else {
          console.error("Signup failed");
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h5" align="center">Sign Up</Typography>
        <TextField
          label="Display Name"
          name="display_name"
          type="text"
          fullWidth
          value={form.display_name}
          onChange={handleChange}
          required
        />
        
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
          fullWidth
          value={form.password}
          onChange={handleChange}
          required
        />
        
        <Button type="submit" variant="contained" fullWidth>Sign Up</Button>
        <Typography align="center" variant="body2">
          Already have an account?{" "}
          <Link onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
