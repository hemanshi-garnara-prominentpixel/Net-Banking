import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";

const NetBankingRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default NetBankingRoutes;
