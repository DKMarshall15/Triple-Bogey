import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useOutletContext } from "react-router-dom"; // Add this import
import CourseCard from "../components/CourseCard.jsx";
import { fetchFavoriteCourses } from "./utilities.jsx";
import bgimg from "../assets/images/bridge.jpg";

function FavoritesPage() {
  // Get user from context
  const { contextObj } = useOutletContext();
  const { user } = contextObj;

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
          const courses = favoriteReviews.map((favorite) => favorite.course);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading spinner while fetching favorites
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
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
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          py: 4,
        }}
      >
        <Typography variant="h4" align="left" sx={{ pt: 0, mb: 2 }}>
          Favorite Courses
        </Typography>
        <Box sx={{ flexGrow: 1, mb: 4 }}>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            {currentCourses.map((course) => (
              <Grid size={{ sm: 6, md: 4 }} key={course.course_id}>
                <CourseCard
                  course={course}
                  user={user} // Pass user prop here
                  onFavoriteChange={(courseId, isFavorited) => {
                    if (!isFavorited) {
                      // Remove the course from the favorites list
                      setFavoriteCourses((prev) =>
                        prev.filter((c) => c.course_id !== courseId)
                      );
                      // Reset to page 1 if current page becomes empty
                      const newTotal = favoriteCourses.length - 1;
                      const newTotalPages = Math.ceil(newTotal / coursesPerPage);
                      if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(1);
                      }
                    }
                  }}
                />
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

        {/* Pagination - remove bottom margin */}
        {favoriteCourses.length > 0 && totalPages > 1 && (
          <Box display="flex" justifyContent="center" sx={{ mt: 4, pb: 0 }}>
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
    </Box>
  );
}

export default FavoritesPage;
