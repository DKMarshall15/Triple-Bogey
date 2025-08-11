import { Container, Box, Pagination, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

function CoursesPage() {
  const [courses, setCourses] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('none');
  const coursesPerPage = 12;

  // Sort courses based on selected option
  const getSortedCourses = () => {
    const coursesCopy = [...courses];
    switch (sortOrder) {
      case 'courseId-asc':
        return coursesCopy.sort((a, b) => parseInt(a.course_id) - parseInt(b.course_id));
      case 'courseId-desc':
        return coursesCopy.sort((a, b) => parseInt(b.course_id) - parseInt(a.course_id));
      case 'none':
      default:
        return coursesCopy;
    }
  };

  const sortedCourses = getSortedCourses();
  
  // Calculate pagination values using sorted courses
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = sortedCourses.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };
  // Fetch courses from backend and store in state
  // Use useEffect to call API and set courses state
  // Map through courses to create CourseCard components
  // Example course data structure:
  // {
  //   course_id: "1",
  //   club_name: "Club Name",
  //   course_name: "Course Name",
  //   address: "123 Golf St, City, State, Zip",

  const fetchCourses = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/courses/");
    const courses = await response.json();
    setCourses(courses);
    // Assuming the response is an array of course objects
    // Each course object should have properties like course_id, club_name, course_name, address
    return courses;
  };
  // pagination, search, and filtering can be added later

  // Use useEffect to call fetchCourses and set state
  useEffect(() => {
    const getCourses = async () => {
      const courses = await fetchCourses();
      setCourses(courses);
      // Reset to first page when courses are loaded
      setCurrentPage(1);
    };
    getCourses();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="left" sx={{ mt: 4, mb: 2 }}>
        Search for a Course
      </Typography>
      <TextField
        label="Search Courses"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
      />
      {/* Sort controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-select-label">Sort by</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortOrder}
            label="Sort by"
            onChange={handleSortChange}
          >
            <MenuItem value="none">Default Order</MenuItem>
            <MenuItem value="courseId-asc">Course ID (Low to High)</MenuItem>
            <MenuItem value="courseId-desc">Course ID (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Display current page info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedCourses.length)} of {sortedCourses.length} courses
        </Typography>
      </Box>

      {/* Display current page courses in a grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {currentCourses.length > 0 ? (
          currentCourses.map((course, idx) => (
            <Grid item xs={12} sm={6} md={4} key={course.course_id}>
              <CourseCard course={course} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No courses found.
            </Typography>
          </Grid>
        )}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
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

export default CoursesPage;
