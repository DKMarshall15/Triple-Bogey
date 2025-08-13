import { Container, Box, Card, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { addFavoriteCourse, removeFavoriteCourse, fetchFavoriteCourses } from "../pages/utilities";

function CourseCard({ course }) {
  // This component will display individual course cards
  // pull courses from backend and iterate through them to create cards
  // Extract course details from the course prop
  const { course_id, club_name, course_name, address } = course;
  const [checked, setChecked] = useState(false);

  // Check if course is in favorites when component mounts
  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        const favorites = await fetchFavoriteCourses();
        console.log('Fetched favorites:', favorites); // Debug log
        console.log('Looking for course_id:', course_id); // Debug log
        
        if (favorites && Array.isArray(favorites)) {
          // Now favorites contains CourseReview objects with full nested course data
          const isFavorited = favorites.some(favorite => {
            // Access the course_id from the nested course object
            const favoriteCourseId = favorite.course.course_id;  // Now you can access course_id
            console.log('Comparing:', favoriteCourseId, 'with', course_id);
            return String(favoriteCourseId) === String(course_id);
          });
          
          console.log('Is favorited:', isFavorited);
          setChecked(isFavorited);
        }
      } catch (error) {
        console.error("Error checking if course is favorited:", error);
      }
    };
    
    checkIfFavorited();
  }, [course_id]);

  const handleFavorites = async () => {
    try {
      if (checked) {
        const success = await removeFavoriteCourse(course_id);
        if (success) {
          setChecked(false);
          console.log(`Course ${course_id} removed from favorites`);
        } else {
          console.error("Failed to remove from favorites");
        }
      } else {
        const result = await addFavoriteCourse(course_id);
        if (result) {
          setChecked(true);
          console.log(`Course ${course_id} added to favorites`);
        } else {
          console.error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

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
      <Checkbox 
        checked={checked}
        sx={{ marginTop: 2 }} 
        icon={<FavoriteBorder />} 
        checkedIcon={<Favorite sx={{ color: "red" }} />} 
        onChange={handleFavorites} 
      />
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} component={Link} to={`/coursedetails/${course_id}`}>
        View Course
      </Button>
      {/* add view course functionality */}
      <Button 
        variant="contained" 
        color="secondary" 
        sx={{ marginTop: 2, marginLeft: 1 }}
        component={Link}
        to={`/play-round/${course_id}`}
      >
        Play Course
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
