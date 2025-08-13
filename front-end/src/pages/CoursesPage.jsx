import { Container, Box, Pagination, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");

  // Number of courses to display per page
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
  // handle search functionality can be added later
  const handleSearch = async () => {
    // Implement search functionality
    const response = await fetch(`http://127.0.0.1:8000/api/v1/courses/${searchQuery}`);
    const courses = await response.json();
    setCourses(courses);
    setCurrentPage(1);
    console.log("Search for:", searchQuery);
    return courses;
  };

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
      {/* Search bar */}
      <Typography variant="h4" align="left" sx={{ mt: 4, mb: 2 }}>
        Search for a Course
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' } }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={handleSearch}>
          Search
        </Button>
      </Box>
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
      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          {currentCourses.length > 0 ? (
            currentCourses.map((course, idx) => (
              <Grid size={{ sm: 6, md: 4 }} key={course.course_id}>
                <CourseCard course={course} />
              </Grid>
            ))
          ) : (
            <Grid>
              <Typography variant="body1" color="text.secondary">
                No courses found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Pagination controls */}
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
