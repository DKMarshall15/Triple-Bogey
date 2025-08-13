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
import { saveScorecard } from "../pages/utilities.jsx";

export default function PlayRoundCard({ courseData, onRoundComplete }) {
  const [selectedTee, setSelectedTee] = useState(courseData.tee_sets[0]);
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(false);

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

  const handleSaveRound = async () => {
    try {
      setSaving(true);
      const roundData = {
        course_id: courseData.course_id,
        tee_set_id: selectedTee.id,
        scores: scores,
        total_score: totalScore,
        date_played: new Date().toISOString().split('T')[0]
      };
      
      const result = await saveScorecard(roundData);
      if (result) {
        alert("Round saved successfully!");
        onRoundComplete && onRoundComplete(result);
      }
    } catch (error) {
      console.error("Error saving round:", error);
      alert("Failed to save round. Please try again.");
    } finally {
      setSaving(false);
    }
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
            const tee = courseData.tee_sets.find(t => t.tee_name === e.target.value);
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hole</TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.hole_number}
                </TableCell>
              ))}
              <TableCell align="center">Total</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Par</TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  {h.par}
                </TableCell>
              ))}
              <TableCell align="center">{selectedTee.par_total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Score</TableCell>
              {selectedTee.holes.map((h) => (
                <TableCell key={h.hole_number} align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={scores[h.hole_number] || ""}
                    onChange={(e) =>
                      handleScoreChange(h.hole_number, e.target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        style: { textAlign: "center", width: "50px" },
                      },
                    }}
                  />
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography variant="h6">{totalScore || 0}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveRound}
          disabled={saving || totalScore === 0}
        >
          {saving ? "Saving..." : "Save Round"}
        </Button>
      </Box>
    </Box>
  );
}