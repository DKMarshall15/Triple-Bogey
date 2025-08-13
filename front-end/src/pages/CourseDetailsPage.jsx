import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { fetchCourseDetails } from "./utilities";
import GolfScorecard from "../components/ScorecardCard.jsx";

function CourseDetailsPage() {
  const { course_id } = useParams();
  const { contextObj } = useOutletContext(); // Get user context
  const { user } = contextObj;
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTee, setSelectedTee] = useState(null);

  // Filter tee sets based on user gender
  const getFilteredTeeSets = (teeSets) => {
    if (!user || !user.gender || user.gender === 'other' || user.gender === 'unknown') {
      // Show all tee sets for users with no gender, 'other', or 'unknown'
      return teeSets;
    }
    
    // Filter tee sets to match user's gender
    return teeSets.filter(teeSet => teeSet.gender === user.gender);
  };

  const filteredTeeSets = courseDetails ? getFilteredTeeSets(courseDetails.tee_sets) : [];

  // Add callback function to handle tee selection
  const handleTeeChange = (teeData) => {
    setSelectedTee(teeData);
  };

  useEffect(() => {
    const getCourseDetails = async () => {
      console.log("course_id from useParams:", course_id); // Debug line
      try {
        setLoading(true);
        setError(null);
        console.log("Calling fetchCourseDetails with:", course_id); // Debug line
        const details = await fetchCourseDetails(course_id);
        console.log("Received course details:", details); // Debug line
        setCourseDetails(details);
      } catch (err) {
        setError("Failed to load course details");
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      getCourseDetails();
    } else {
      console.log("No course_id found in URL params"); // Debug line
      setLoading(false);
      setError("No course ID provided");
    }
  }, [course_id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!courseDetails) {
    return (
      <Box p={2}>
        <Alert severity="info">Course not found</Alert>
      </Box>
    );
  }

  return (
    <Container>
      <Box p={2} mt={2}>
        <Typography variant="h3">Course Information:</Typography>
        {/* Display course information */}
        <Box mt={2} sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left side - Course Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                Course ID: {course_id}
              </Typography>
              <Typography variant="h5" component="div">
                Course Name: {courseDetails.course_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {courseDetails.address}
              </Typography>
            </Box>
            
            {/* Right side - Ratings */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Ratings</Typography>
              {selectedTee ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedTee.tee_name} Tees ({selectedTee.gender}) - {selectedTee.total_yards} yards
                  </Typography>
                  <Typography variant="body1">
                    Course Rating: {selectedTee.course_rating}
                  </Typography>
                  <Typography variant="body1">
                    Slope Rating: {selectedTee.slope_rating}
                  </Typography>
                  <Typography variant="body1">
                    Bogey Rating: {selectedTee.bogey_rating}
                  </Typography>
                  <Typography variant="body1">
                    Par: {selectedTee.par_total}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a tee below to view ratings
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box mt={3}>
          <GolfScorecard 
            courseData={{...courseDetails, tee_sets: filteredTeeSets}} 
            readOnly={true} 
            onTeeChange={handleTeeChange}
          />
        </Box>
        {/* Mapbox map will be rendered here */}
        <Box mt={3}>
          <Typography variant="h6">Course Location:</Typography>
          {courseDetails.latitude && courseDetails.longitude ? (
            <Typography variant="body2">
              Coordinates: {courseDetails.latitude}, {courseDetails.longitude}
            </Typography>
          ) : (
            <Typography variant="body2">
              Location coordinates not available
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default CourseDetailsPage;
