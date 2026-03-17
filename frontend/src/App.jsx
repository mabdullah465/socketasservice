import { useState } from "react";
import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Projectpage from "./components/Projectpage";
import MainLayout from "./components/Layout";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />, 
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <DashBoard />,
        },
        {
          path: "project/:projectId",
          element: <Projectpage />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
