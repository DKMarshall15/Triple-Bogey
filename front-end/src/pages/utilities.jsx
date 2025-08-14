import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userSignUp = async (username, email, password, gender) => {
    try {
        let response = await api.post("users/signup/", {
            username: username,
            email: email,
            password: password,
            gender: gender,
        });
        if (response.status === 201) {
            let { user, token } = response.data;
            // Store the token securely (e.g., in localStorage or HttpOnly cookies)
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            return user;
        }
    } catch (error) {
        // Handle error response
        if (error.response && error.response.data) {
            // If the error response has a message, show it
            const errorMessage = typeof error.response.data === 'string' 
                ? error.response.data 
                : error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
            alert(errorMessage);
        } else {
            alert("Signup failed. Please try again.");
        }
    }
    return null;
};

export const userLogin = async (email, password) => {
  try {
    let response = await api.post("users/login/", {
      email: email,
      password: password,
    });
    if (response.status === 200) {
      let { user, token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      return user;
    }
  } catch (error) {
    // Handle error response
    if (error.response && error.response.data) {
      const errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      alert(errorMessage);
    } else {
      alert("Login failed. Please try again.");
    }
  }
  return null;
};

export const userLogOut = async () => {
  try {
    let response = await api.post("users/logout/");
    if (response.status === 204) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return true; // Return success
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Let the calling component handle the error
  }
  return false;
};

export const userConfirmation = async () => {
  let token = localStorage.getItem("token");
  if (token) {
    try {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      let response = await api.get("users/profile/");
      if (response.status === 200) {
        return response.data.user;
      }
    } catch (error) {
      // Token might be invalid, remove it
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      console.error("User confirmation failed:", error);
    }
  }
  return null;
};

export const fetchFavoriteCourses = async () => {
  try {
    let response = await api.get("reviews/favorites/");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching favorite courses:", error);
    alert("Failed to fetch favorite courses. Please try again.");
  }
  return null;
};

export const addFavoriteCourse = async (courseId) => {
  try {
    let response = await api.post(`reviews/favorites/${courseId}/`);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error adding course to favorites:", error);
    alert("Failed to add course to favorites. Please try again.");
  }
  return null;
}

export const removeFavoriteCourse = async (courseId) => {
  try {
    let response = await api.delete(`reviews/favorites/${courseId}/`);
    if (response.status === 204 || response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error removing course from favorites:", error);
    alert("Failed to remove course from favorites. Please try again.");
  }
  return false;
}

export const fetchCourseWithTees = async (courseId) => {
  try {
    let response = await api.get(`courses/course/${courseId}/`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching course with tees:", error);
    alert("Failed to fetch course data. Please try again.");
  }
  return null;
}


export const fetchCourseDetails = async (courseId) => {
  try {
    let response = await api.get(`courses/course/${courseId}/`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    alert("Failed to fetch course details. Please try again.");
  }
  return null;
}

// Notes API calls
export const fetchCourseNotes = async (courseId) => {
  try {
    let response = await api.get(`reviews/${courseId}/`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No notes found
    }
    console.error("Error fetching course notes:", error);
    throw error; // Let the component handle the error
  }
  return null;
};

export const saveOrUpdateCourseNotes = async (courseId, notesData) => {
  // First check if notes exist
  const existingNotes = await fetchCourseNotes(courseId);
  const method = existingNotes ? 'put' : 'post';
  
  try {
    let response = await api[method](`reviews/${courseId}/`, notesData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(`Error ${method === 'post' ? 'saving' : 'updating'} course notes:`, error);
    throw error;
  }
  return null;
};

export const deleteCourseNotes = async (courseId) => {
  try {
    let response = await api.delete(`reviews/${courseId}/`);
    if (response.status === 204 || response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting course notes:", error);
    throw error;
  }
  return false;
};

// Create a new scorecard
export const createScorecard = async (courseId, scoresData) => {
  try {
    let response = await api.post("scorecards/", {
      course_id: courseId,
      scores: scoresData // Pass the scores data from PlayRoundCard
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating scorecard:", error);
    throw error;
  }
  return null;
};

// Get a single scorecard by ID
export const fetchSingleScorecard = async (scorecardId) => {
  try {
    console.log("Fetching scorecard with ID:", scorecardId); // Add debug log
    let response = await api.get(`scorecards/${scorecardId}/`);
    console.log("Scorecard response:", response.data); // Add debug log
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching scorecard:", error);
    console.error("Error response:", error.response?.data); // More detailed error
    throw error;
  }
  return null;
};

// Update scorecard with multiple hole scores
export const updateScorecard = async (scorecardId, entries) => {
  try {
    let response = await api.put(`scorecards/${scorecardId}/`, {
      entries: entries
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating scorecard:", error);
    throw error;
  }
  return null;
};

// Update a single score entry
export const updateScoreEntry = async (entryId, strokes) => {
  try {
    let response = await api.patch(`scorecards/entry/${entryId}/`, {
      strokes: strokes
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating score entry:", error);
    throw error;
  }
  return null;
};

// Delete a scorecard
export const deleteScorecard = async (scorecardId) => {
  try {
    let response = await api.delete(`scorecards/${scorecardId}/`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting scorecard:", error);
    throw error;
  }
  return false;
};

// Remove the old saveScorecard function and rename fetchUserScorecards for clarity
export const fetchAllUserScorecards = async () => {
  try {
    let response = await api.get("scorecards/");
    console.log("Raw scorecards response:", response); // Add debug log
    console.log("Response data:", response.data); // Add debug log
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching scorecards:", error);
    throw error;
  }
  return null;
};