import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./pages/logIn";
import Restaurants from "./components/restaurants";
import Users from "./components/users";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import OTP from "./pages/otp";
import ForgotPassword from "./pages/forgotPassword";
import ChangePassword from "./pages/changePassword";
import Registration from "./pages/registration";
import Chat from "./components/chat";
import Refund from "./pages/refund";
import ResetPassword from "./pages/resetPassword";

import "./components/sidebar.css";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import Dashboard from "./pages/dashboard";
import Error from "./pages/error";
import DisputedList from "./pages/disputedList";

const SidebarData = [
  {
    id: 5,
    title: "Refund",
    path: "/refund",
  },
  {
    id: 6,
    title: "Chat Support",
    path: "/support",
  },
];
const Sidebar = ({ user }) => {
  const isAdmin = user.role === "admin";
  const isSupport = user.role === "support";

  const adminRoutes = [
    { id: 1, title: "Dashboard", path: "/" },
    { id: 2, title: "Restaurants", path: "/restaurants" },
    { id: 3, title: "Users", path: "/users" },
    { id: 4, title: "Add Role", path: "/register" },
    { id: 7, title: "Dispute List", path: "/dispute" },
    ...SidebarData,
  ];

  const supportRoutes = [...SidebarData];

  const routes = isAdmin ? adminRoutes : isSupport ? supportRoutes : [];

  return (
    <div className="sidebar">
      <img
        className="img-fuild ms-4 my-3"
        style={{ width: "200px" }}
        src={logo}
        alt="logo"
      />
      <h5 className="text-white text-center mt-3">{user.username}</h5>
      <p className="text-center mb-5" style={{ color: "#F8B460" }}>
        {user.role}
      </p>
      {routes.map((data) => (
        <ul className="ms-4 mt-4" key={data.id}>
          <li className="nav-link">
            <Link className="text-decoration-none text-white" to={data.path}>
              {data.title}
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    userId: 0,
    username: "",
    email: "",
    role: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const stored_token = Cookies.get("token") || "";
    if (stored_token) {
      try {
        setToken(stored_token);
        const decoded = jwtDecode(stored_token);
        setUser({
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token:", error.message);
      }
    }
  }, [isLoggedIn]);

  console.log(token, isLoggedIn, user);

  return (
    <BrowserRouter>
      {/* Place Navigate component here */}
      {!token && <Navigate to="/login" />}
      {/* {!token && (
        <>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </>
      )} */}
      <div className="row me-0">
        {/* Sidebar and main content */}
        {token && (
          <div className="col-md-3">
            <Sidebar user={user} />
          </div>
        )}
        <div className={token ? "col-md-8" : "col-md-12"}>
          <Routes>
            {/* Route for the login page */}
            <Route
              path="/login"
              element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
            />
            {/* Routes for logged in users */}
            <Route
              path="/"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/dispute"
              element={<DisputedList admin_name={user.username} />}
            />
            <Route path="/refund" element={<Refund />} />
            <Route
              path="/support"
              element={
                (token && user.role === "support") || user.role === "admin" ? (
                  <Chat admin_name={user.username} />
                ) : (
                  <Error />
                )
              }
            />
            {/* Routes for admin */}
            {token && user.role === "admin" && (
              <>
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/users" element={<Users />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/support" element={<Chat />} />
              </>
            )}
            {/* Routes for support */}
            {token && user.role === "support" && (
              <>
                <Route path="/refund" element={<Refund />} />
                <Route path="/support" element={<Chat />} />
              </>
            )}
            <Route path="/error" element={<Error />} /> Error page
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
