import { useState, useEffect } from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import CourseCard from "../components/CourseCard.jsx";
import { fetchFavoriteCourses } from "./utilities.jsx";

function FavoritesPage() {
  const [favoriteCourses, setFavoriteCourses] = useState([]);

  useEffect(() => {
    fetchFavoriteCourses().then(favoriteReviews => {
      if (favoriteReviews && Array.isArray(favoriteReviews)) {
        // Extract the course data from the CourseReview objects
        const courses = favoriteReviews.map(favorite => favorite.course);
        setFavoriteCourses(courses);
      }
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="left" sx={{ mt: 4, mb: 2 }}>
        Favorite Courses
      </Typography>
      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          {favoriteCourses.map((course) => (
            <Grid size={{ sm: 6, md: 4 }} key={course.course_id}>
              <CourseCard course={course} />
            </Grid>
          ))}
          {/* If no favorite courses, display a message */}
          {favoriteCourses.length === 0 && (
            <Grid>
              <Typography variant="h6" align="center">
                No favorite courses found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default FavoritesPage;
