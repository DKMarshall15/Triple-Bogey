import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import { fetchUserScorecards } from "./utilities.jsx";

function ScorecardsPage() {
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScorecards = async () => {
      try {
        const data = await fetchUserScorecards();
        setScorecards(data || []);
      } catch (error) {
        console.error("Error loading scorecards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScorecards();
  }, []);

  if (loading) {
    return <Container><Typography>Loading scorecards...</Typography></Container>;
  }

  return (
    <Container>
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
            <Grid item xs={12} sm={6} md={4} key={scorecard.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{scorecard.course.course_name}</Typography>
                  <Typography color="text.secondary">{scorecard.course.club_name}</Typography>
                  <Typography variant="h4" color="primary">
                    Score: {scorecard.total_score}
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(scorecard.date_played).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Tee: {scorecard.tee_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ScorecardsPage;