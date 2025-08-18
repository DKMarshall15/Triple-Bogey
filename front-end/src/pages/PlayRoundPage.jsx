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
import { fetchCourseDetails, createScorecard } from "./utilities"; // Make sure createScorecard is imported!
import bgimg from "../assets/images/putting.jpg";
import CourseNotes from "../components/CourseNotes.jsx";
import MapboxExample from "../components/GolfMap.jsx";

export default function PlayRoundPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        console.log("Fetching course with ID:", course_id);
        const data = await fetchCourseDetails(course_id);
        console.log("Course data received:", data);
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

  // Handle scorecard submission - this is where you create the scorecard
  const handleRoundComplete = async (roundData) => {
    try {
      // Create scorecard with the submitted scores
      const newScorecard = await createScorecard(course_id, roundData);

      navigate("/courses", {
        state: {
          message: "Round saved successfully!",
          roundData: newScorecard,
        },
      });
    } catch (error) {
      console.error("Failed to save scorecard:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleBackToCourse = () => {
    navigate(`/coursedetails/${course_id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box
        sx={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box mt={4}>
            <Alert severity="warning">Course not found</Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
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

          {/* Scorecard Component */}
          <Paper elevation={3}>
            <PlayRoundCard
              courseData={courseData}
              onRoundComplete={handleRoundComplete}
            />
          </Paper>

          {/* Course notes */}
          <CourseNotes course={courseData} />
          <Box mt={3}>
            <Typography variant="h6">Course Location:</Typography>
            {courseData.latitude && courseData.longitude ? (
              <MapboxExample 
            latitude={courseData.latitude}
            longitude={courseData.longitude}
            courseName={courseData.course_name}
          />
            ) : (
              <Typography variant="body2">
                Location coordinates not available
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
