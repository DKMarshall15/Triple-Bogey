import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

export const userSignUp = async (email, password) => {
  try {
    let response = await api.post("users/signup/", {
      email: email,
      password: password,
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
      return null;
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Something went wrong and logout failed");
  }
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