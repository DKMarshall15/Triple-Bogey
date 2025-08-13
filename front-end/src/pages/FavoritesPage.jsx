import { useState, useEffect } from "react";
import { Container, Box, Typography, Grid, CircularProgress, Pagination } from "@mui/material";
import CourseCard from "../components/CourseCard.jsx";
import { fetchFavoriteCourses } from "./utilities.jsx";

function FavoritesPage() {
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; // Adjust this number as needed

  useEffect(() => {
    const getFavoriteCourses = async () => {
      try {
        setLoading(true);
        const favoriteReviews = await fetchFavoriteCourses();
        if (favoriteReviews && Array.isArray(favoriteReviews)) {
          // Extract the course data from the CourseReview objects
          const courses = favoriteReviews.map(favorite => favorite.course);
          setFavoriteCourses(courses);
        }
      } catch (error) {
        console.error("Error fetching favorite courses:", error);
      } finally {
        setLoading(false);
      }
    };

    getFavoriteCourses();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(favoriteCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = favoriteCourses.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of the page when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading spinner while fetching favorites
  if (loading) {
    return (
      <Container>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading favorite courses...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="left" sx={{ mt: 4, mb: 2 }}>
        Favorite Courses
      </Typography>
      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          {currentCourses.map((course) => (
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
      
      {/* Pagination - only show if there are courses and more than one page */}
      {favoriteCourses.length > 0 && totalPages > 1 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          sx={{ mt: 4, mb: 4 }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}

export default FavoritesPage;
