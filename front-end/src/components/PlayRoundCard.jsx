import React, { useState } from "react";
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
  Button,
} from "@mui/material";

export default function PlayRoundCard({ courseData, onRoundComplete }) {
  const [selectedTee, setSelectedTee] = useState(courseData.tee_sets[0]);
  const [scores, setScores] = useState({});

  const handleScoreChange = (holeNumber, value) => {
    setScores((prev) => ({
      ...prev,
      [holeNumber]: value,
    }));
  };

  const totalScore = Object.values(scores).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const handleSubmitRound = () => {
    console.log("Full selectedTee object:", selectedTee);
    console.log("Available properties:", Object.keys(selectedTee));
    console.log("selectedTee.id:", selectedTee.id);
    console.log("selectedTee.tee_set_id:", selectedTee.tee_set_id);
    console.log("selectedTee.pk:", selectedTee.pk);

    const scoresData = selectedTee.holes.map((hole) => ({
      hole_number: hole.hole_number,
      strokes: scores[hole.hole_number] || 0,
      par: hole.par,
    }));

    // Try different possible ID properties
    const teeSetId = selectedTee.id || selectedTee.tee_set_id || selectedTee.pk;
    console.log("Final teeSetId being sent:", teeSetId);

    onRoundComplete({
      scores: scoresData,
      tee_set_id: teeSetId,
      selectedTee: selectedTee,
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Playing: {courseData.course_name}
      </Typography>

      <Box mb={2}>
        <Select
          value={selectedTee.tee_name}
          onChange={(e) => {
            const tee = courseData.tee_sets.find(
              (t) => t.tee_name === e.target.value
            );
            setSelectedTee(tee);
          }}
        >
          {courseData.tee_sets.map((tee, idx) => (
            <MenuItem key={idx} value={tee.tee_name}>
              {tee.tee_name} — {tee.total_yards} yds
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
          "& .MuiTable-root": {
            minWidth: 650,
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  minWidth: 60,
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                Hole
              </TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell
                  key={h.hole_number}
                  align="center"
                  sx={{ minWidth: 50, fontWeight: "bold" }}
                >
                  {h.hole_number}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 60 }}>
                Total
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
              >
                Par
              </TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.par}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {selectedTee.par_total}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
              >
                Yards
              </TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.yardage}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {selectedTee.total_yards}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
              >
                HCP
              </TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.handicap}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>

            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#fafafa",
                  zIndex: 1,
                }}
              >
                Score
              </TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={scores[h.hole_number] || ""}
                    onChange={(e) =>
                      handleScoreChange(h.hole_number, e.target.value)
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        width: "40px",
                        height: "20px",
                        padding: "4px",
                      },
                    }}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: 15,
                      },
                    }}
                  />
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {totalScore || 0}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitRound}
          disabled={totalScore === 0}
        >
          Submit Round
        </Button>
      </Box>
    </Box>
  );
}