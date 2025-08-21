import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // Add this import
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchAllUserScorecards,
  fetchSingleScorecard,
  updateScoreEntry,
  deleteScorecard
} from "./utilities.jsx";
import bgimg from "../assets/images/fairway.jpg";

function ScorecardsPage() {
  const { contextObj } = useOutletContext(); // Add this line
  const { user } = contextObj; // Add this line
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingScorecard, setEditingScorecard] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scorecardToDelete, setScorecardToDelete] = useState(null);
  const [editedScores, setEditedScores] = useState({});

  useEffect(() => {
    loadScorecards();
  }, []);

  const loadScorecards = async () => {
    try {
      setLoading(true);
      const scorecards = await fetchAllUserScorecards();
      console.log("Scorecards received:", scorecards); // Add this debug log
      console.log("First scorecard:", scorecards?.[0]); // Check structure of first scorecard
      setScorecards(scorecards || []);
      setError(null);
    } catch (error) {
      console.error("Failed to load scorecards:", error);
      setError("Failed to load scorecards");
    } finally {
      setLoading(false);
    }
  };

  const handleEditScorecard = async (scorecard) => {
    try {
      console.log("Editing scorecard:", scorecard); // This should show the scorecard object
      console.log("Scorecard ID:", scorecard.id); // Check if ID exists

      if (!scorecard.id) {
        throw new Error("Scorecard ID is missing");
      }

      // Fetch full scorecard details with entries
      const fullScorecard = await fetchSingleScorecard(scorecard.id);
      console.log("Full scorecard data:", fullScorecard);

      if (!fullScorecard || !fullScorecard.entries) {
        throw new Error("Invalid scorecard data received");
      }

      setEditingScorecard(fullScorecard);

      // Initialize edited scores with current values
      const initialScores = {};
      fullScorecard.entries.forEach(entry => {
        initialScores[entry.id] = entry.strokes;
      });
      setEditedScores(initialScores);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching scorecard details:", error);
      setError(`Failed to load scorecard details: ${error.message}`);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Update each changed score entry
      for (const [entryId, strokes] of Object.entries(editedScores)) {
        await updateScoreEntry(entryId, strokes);
      }

      setEditDialogOpen(false);
      setEditingScorecard(null);
      setEditedScores({});
      await loadScorecards(); // Refresh the list
    } catch (error) {
      console.error("Error updating scorecard:", error);
      setError("Failed to update scorecard");
    }
  };

  const handleDeleteScorecard = async () => {
    try {
      await deleteScorecard(scorecardToDelete.id);
      setDeleteDialogOpen(false);
      setScorecardToDelete(null);
      await loadScorecards(); // Refresh the list
    } catch (error) {
      console.error("Error deleting scorecard:", error);
      setError("Failed to delete scorecard");
    }
  };

  const handleScoreChange = (entryId, newScore) => {
    setEditedScores(prev => ({
      ...prev,
      [entryId]: parseInt(newScore) || 0
    }));
  };

  // Add the same filtering function from other pages
  const getFilteredTeeSets = (teeSets) => {
    if (
      !user ||
      !user.gender ||
      user.gender === "other" ||
      user.gender === "unknown"
    ) {
      return teeSets;
    }

    return teeSets.filter((teeSet) => teeSet.gender === user.gender);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${bgimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
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
              Loading scorecards...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
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
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          My Scorecards
        </Typography>

        {scorecards.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No scorecards yet. Play a round to get started!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {scorecards.map((scorecard) => (
              <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }} key={scorecard.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6">{scorecard.course.course_name}</Typography>
                        <Typography color="text.secondary">{scorecard.course.club_name}</Typography>
                        <Typography variant="h4" color="primary">
                          Score: {scorecard.total_strokes}
                        </Typography>
                        <Typography variant="body2">
                          Date: {new Date(scorecard.date_played).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Tee: {scorecard.tee_set.tee_name}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleEditScorecard(scorecard)}
                          color="primary"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setScorecardToDelete(scorecard);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Edit Scorecard - {editingScorecard?.course.course_name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {editingScorecard?.entries.map((entry) => (
                <Grid item xs={6} sm={4} md={3} key={entry.id}>
                  <TextField
                    label={`Hole ${entry.tee_hole.hole_number}`}
                    type="number"
                    fullWidth
                    value={editedScores[entry.id] || entry.strokes}
                    onChange={(e) => handleScoreChange(entry.id, e.target.value)}
                    helperText={`Par ${entry.tee_hole.par}`}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Scorecard</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this scorecard for {scorecardToDelete?.course.course_name}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteScorecard}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ScorecardsPage;