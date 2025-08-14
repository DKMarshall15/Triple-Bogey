import { Container, Box, Card, Typography, Button, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { StickyNote2 } from "@mui/icons-material";
import { addFavoriteCourse, removeFavoriteCourse, fetchFavoriteCourses } from "../pages/utilities";
import CourseNotes from "./CourseNotes.jsx";

function CourseCard({ course, user, onFavoriteChange }) { // Add user prop
  const { course_id, club_name, course_name, address } = course;
  const [checked, setChecked] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);

  // Check if course is in favorites when component mounts - ONLY if user is logged in
  useEffect(() => {
    const checkIfFavorited = async () => {
      // Only fetch favorites if user is logged in
      if (!user) {
        setChecked(false);
        return;
      }

      try {
        const favorites = await fetchFavoriteCourses();
        console.log('Fetched favorites:', favorites);
        console.log('Looking for course_id:', course_id);
        
        if (favorites && Array.isArray(favorites)) {
          const isFavorited = favorites.some(favorite => {
            const favoriteCourseId = favorite.course.course_id;
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
  }, [course_id, user]); // Add user as dependency

  const handleFavorites = async () => {
    // Don't allow favorites if user is not logged in
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      if (checked) {
        const success = await removeFavoriteCourse(course_id);
        if (success) {
          setChecked(false);
          console.log(`Course ${course_id} removed from favorites`);
          if (onFavoriteChange) {
            onFavoriteChange(course_id, false);
          }
        } else {
          console.error("Failed to remove from favorites");
        }
      } else {
        const result = await addFavoriteCourse(course_id);
        if (result) {
          setChecked(true);
          console.log(`Course ${course_id} added to favorites`);
          if (onFavoriteChange) {
            onFavoriteChange(course_id, true);
          }
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
      
      {/* Conditionally render favorites and notes based on login status */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, gap: 1 }}>
        {/* Only show notes button if user is logged in */}
        {user && (
          <IconButton
            onClick={() => setNotesDialogOpen(true)}
            color="primary"
            title="Course Notes"
          >
            <StickyNote2 />
          </IconButton>
        )}
        
        {/* Only show favorites checkbox if user is logged in */}
        {user && (
          <Checkbox 
            checked={checked}
            icon={<FavoriteBorder />} 
            checkedIcon={<Favorite sx={{ color: "red" }} />} 
            onChange={handleFavorites} 
          />
        )}
      </Box>

      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} component={Link} to={`/coursedetails/${course_id}`}>
        View Course
      </Button>
      
      {/* Only show Play Course button if user is logged in */}
      {user && (
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ marginTop: 2, marginLeft: 1 }}
          component={Link}
          to={`/play-round/${course_id}`}
        >
          Play Course
        </Button>
      )}
    </Box>
  );

  return (
    <Box>
      <Card>{card}</Card>
      
      {/* Only show Notes Dialog if user is logged in */}
      {user && notesDialogOpen && (
        <CourseNotes
          course={course}
          isDialog={true}
          onClose={() => setNotesDialogOpen(false)}
        />
      )}
    </Box>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  user: PropTypes.object, // Add user prop type
  onFavoriteChange: PropTypes.func,
};

export default CourseCard;
