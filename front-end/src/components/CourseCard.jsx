import { Container, Box, Card, Typography, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

function CourseCard({ course }) {
  // This component will display individual course cards
  // pull courses from backend and iterate through them to create cards
  // Extract course details from the course prop
  const { course_id, club_name, course_name, address } = course;

  const card = (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
        Course ID: {course_id}
      </Typography>
      <Typography variant="h5" component="div">
        Club Name: {club_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Course Name: {course_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Address: {address}
      </Typography>
      <Checkbox sx={{ marginTop: 2 }} icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: "red" }} />} />
      {/* add favorite button functionality */}
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
        View Course
      </Button>
      {/* add view course functionality */}
    </Box>
  );
  return (
    <Box>
      <Card>{card}</Card>
    </Box>
  );
}

export default CourseCard;
