import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function GolfScorecard({ courseData, readOnly = false, onTeeChange }) {
  const [selectedTee, setSelectedTee] = useState(courseData?.tee_sets?.[0] || null);
  const [scores, setScores] = useState({});

  // Notify parent component when tee changes
  useEffect(() => {
    if (onTeeChange && selectedTee) {
      onTeeChange(selectedTee);
    }
  }, [selectedTee, onTeeChange]);

  // Handle score change for each hole
  const handleScoreChange = (holeNumber, value) => {
    if (!readOnly) {
      setScores((prev) => ({
        ...prev,
        [holeNumber]: value,
      }));
    }
  };

  // Calculate totals
  const totalScore = Object.values(scores).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  // Safety check for courseData
  if (!courseData || !courseData.tee_sets || courseData.tee_sets.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body1">No tee data available for this course</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {courseData.course_name} — Scorecard
      </Typography>

      {/* Tee Selection */}
      <Box mb={2} sx={{ minWidth: 200 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Tee</InputLabel>
          <Select
            value={selectedTee?.tee_name || ''}
            label="Select Tee"
            onChange={(e) => {
              const tee = courseData.tee_sets.find(
                (t) => t.tee_name === e.target.value
              );
              setSelectedTee(tee);
              setScores({}); // reset scores when switching tees
            }}
          >
            {courseData.tee_sets.map((tee, idx) => (
              <MenuItem key={idx} value={tee.tee_name}>
                {tee.tee_name} — {tee.total_yards} yds
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Scorecard Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxWidth: '100%', 
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: 650
          }
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 60 }}>Hole</TableCell>
              {selectedTee?.holes?.map((h) => (
                <TableCell key={h.hole_number} align="center" sx={{ minWidth: 50, fontWeight: 'bold' }}>
                  {h.hole_number}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 60 }}>Total</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Par</TableCell>
              {selectedTee?.holes?.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.par}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {selectedTee?.par_total}
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Yards</TableCell>
              {selectedTee?.holes?.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.yardage}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {selectedTee?.total_yards}
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>HCP</TableCell>
              {selectedTee?.holes?.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.handicap}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          
          {!readOnly && (
            <TableBody>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                {selectedTee?.holes?.map((h) => (
                  <TableCell key={h.hole_number} align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={scores[h.hole_number] || ""}
                      onChange={(e) =>
                        handleScoreChange(h.hole_number, e.target.value)
                      }
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          width: '40px',
                          height: '20px',
                          padding: '4px'
                        }
                      }}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          max: 15
                        }
                      }}
                    />
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {totalScore || ""}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
