import { Container, Box, Card, Typography, Button } from "@mui/material";
import React from "react";

function CourseCard() {
  // This component will display individual course cards
  const card = (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="div">
        Course Title
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Course description goes here. This is a brief overview of the course
        content and features.
      </Typography>
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
        View Course
      </Button>
    </Box>
  );
  return (
    <Box>
      <Card>{card}</Card>
    </Box>
  );
}

export default CourseCard;
