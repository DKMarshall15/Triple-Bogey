import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Save, Cancel, StickyNote2 } from '@mui/icons-material';
import { fetchCourseNotes, saveOrUpdateCourseNotes, deleteCourseNotes } from '../pages/utilities';

function CourseNotes({ course, isDialog = false, onClose }) {
  const [notes, setNotes] = useState('');
  const [originalNotes, setOriginalNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [course.course_id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesData = await fetchCourseNotes(course.course_id);
      console.log('Notes data received:', notesData); // Add this debug line
      
      if (notesData && notesData.comment && notesData.comment.trim() !== '') {
        // Only consider it as having notes if comment exists and is not empty
        setNotes(notesData.comment);
        setOriginalNotes(notesData.comment);
        setHasNotes(true);
      } else {
        setNotes('');
        setOriginalNotes('');
        setHasNotes(false);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes('');
      setOriginalNotes('');
      setHasNotes(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (notes.trim() === '') {
      if (hasNotes) {
        await handleDelete();
      }
      return;
    }

    try {
      setLoading(true);
      await saveOrUpdateCourseNotes(course.course_id, { comment: notes.trim() });
      setOriginalNotes(notes.trim());
      setHasNotes(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      setNotes(originalNotes);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCourseNotes(course.course_id);
      setNotes('');
      setOriginalNotes('');
      setHasNotes(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNotes(originalNotes);
    setIsEditing(false);
  };

  const content = (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <StickyNote2 sx={{ mr: 1 }} />
        <Typography variant="h6">
          Notes for {course.course_name}
        </Typography>
      </Box>

      {isEditing ? (
        <Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes about this course..."
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            {hasNotes && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
                disabled={loading}
              >
                Clear Notes
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          {hasNotes ? (
            <Box>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {notes}
                </Typography>
              </Paper>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Notes
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No notes for this course yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Add Notes
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  if (isDialog) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Course Notes</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return content;
}

export default CourseNotes;