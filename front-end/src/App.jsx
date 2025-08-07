import "@fontsource/roboto";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import theme from "./assets/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";


function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Outlet context={{ user: "John Doe" }} /> {/* This Outlet will render the child routes defined in the router.jsx */}
      </ThemeProvider>
    </>
  );
}

export default App;
