import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useOutletContext, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { userLogin, userSignUp } from "./utilities";



export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", gender: "" });
  const { contextObj } = useOutletContext();
  const { setUser } = contextObj;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup form data:", form);
    
    userSignUp(form.username, form.email, form.password, form.gender)
      .then((user) => {
        if (user) {
          setUser(user);
          navigate("/courses"); // Remove the extra userLogin call
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
          label="Username"
          name="username"
          type="text"
          fullWidth
          value={form.username}
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
          autoComplete="new-password"
          fullWidth
          value={form.password}
          onChange={handleChange}
          required
        />
        {/* gender radio options */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
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
