import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx"; 
import CoursesPage from "./pages/CoursesPage.jsx"; 
import FavoritesPage from "./pages/FavoritesPage.jsx"; 
import ScorecardPage from "./pages/ScorecardsPage.jsx"; 
import HomePage from "./pages/HomePage.jsx"; 
import SignUpPage from "./pages/SignUpPage.jsx"; 
import LoginPage from "./pages/LoginPage.jsx"; 
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx"; 
import { userConfirmation } from "./pages/utilities.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: userConfirmation, // Assuming you have a userConfirmation function to check user authentication
        children: [
            // Define child routes here if needed
            {
                index: true, // This will render the default component when the path is "/"
                element: <HomePage />, // Default component to render
            },
            {
                path: "/signup",
                element: <SignUpPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/courses",
                element: <CoursesPage />,
            },
            {
                path: "/coursedetails/:course_id",
                element: <CourseDetailsPage />, // Assuming you have a CourseDetailsPage component
            },
            {
                path: "/favorites",
                element: <FavoritesPage />,
            },
            {
                path: "/scorecards",
                element: <ScorecardPage />,
            },
        ],
        errorElement: <NotFoundPage />,
    },
]);

export default router;
// This router can be used in your main entry file (e.g., index.jsx) to render the application
// using <RouterProvider router={router} /> from 'react-router-dom'.