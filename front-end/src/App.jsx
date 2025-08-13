import "@fontsource/roboto";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import theme from "./assets/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";


function App() {
  const [user, setUser] = useState(useLoaderData());

  useEffect(() => {
    console.log("Full user object:", user);
    if (user) {
      console.log("Username:", user.username);
      console.log("Gender:", user.gender);
      console.log("Display name:", user.display_name);
    }
  }, [user]);

  const contextObj = { user, setUser };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar user={user} setUser={setUser} />
        <Outlet context={{ contextObj }} /> {/* This Outlet will render the child routes defined in the router.jsx */}
      </ThemeProvider>
    </>
  );
}

export default App;
