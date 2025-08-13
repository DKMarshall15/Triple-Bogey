import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import PlayRoundCard from "../components/PlayRoundCard";
import { fetchCourseDetails } from "./utilities";

export default function PlayRoundPage() {
  const { course_id } = useParams(); // Changed from courseId to course_id
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        console.log("Fetching course with ID:", course_id); // Debug log
        const data = await fetchCourseDetails(course_id);
        console.log("Course data received:", data); // Debug log
        setCourseData(data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      fetchCourseData();
    } else {
      console.error("No course_id found in URL params");
      setError("No course ID provided");
      setLoading(false);
    }
  }, [course_id]);

  const handleRoundComplete = (result) => {
    navigate("/courses", {
      state: {
        message: "Round saved successfully!",
        roundData: result,
      },
    });
  };

  const handleBackToCourse = () => {
    navigate(`/coursedetails/${course_id}`); // Updated to match your route pattern
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading course details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="warning">Course not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={2} mb={4}>
        {/* Header with back button */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToCourse}
            sx={{ mr: 2 }}
          >
            Back to Course Details
          </Button>
          <Typography variant="h4" component="h1">
            Play Round
          </Typography>
        </Box>

        {/* Course Info Card */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {courseData.course_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {courseData.location}
          </Typography>
          {courseData.description && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {courseData.description}
            </Typography>
          )}
        </Paper>

        {/* Scorecard Component */}
        <Paper elevation={3}>
          <PlayRoundCard
            courseData={courseData}
            onRoundComplete={handleRoundComplete}
          />
        </Paper>
      </Box>
    </Container>
  );
}