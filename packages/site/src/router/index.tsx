import React from "react";

import { Navigate, createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import Home from "@/pages/Home";
import { Login } from "@/pages/Login";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Navigate to='/login' />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
