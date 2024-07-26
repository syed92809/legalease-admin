import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LogIn from "./pages/logIn";
import Restaurants from "./components/restaurants";
import Users from "./components/users";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Corrected import statement
import Registration from "./pages/registration";

import "./components/sidebar.css";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import Dashboard from "./pages/dashboard";
import Error from "./pages/error";
import NewLawyers from "./components/new_lawyers";

const SidebarData = [
  { id: 1, title: "Dashboard", path: "/" },
  { id: 2, title: "Lawyers", path: "/restaurants" },
  { id: 3, title: "Users", path: "/users" },
  { id: 4, title: "New Lawyers", path: "/newlawyers" },
  { id: 5, title: "Add User", path: "/register" },
  { id: 6, title: "Log Out", path: "/login" },
];

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async (title) => {
    if (title === "Log Out") {
      await Cookies.remove("token");
      window.location.reload();
    }
  };

  return (
    <div className="sidebar">
      <img
        className="img-fluid ms-4 my-3"
        style={{ width: "200px" }}
        src={logo}
        alt="logo"
      />
      <h5 className="text-white text-center mt-3">{user.username}</h5>
      <p className="text-center mb-5" style={{ color: "#FFFFFF" }}>
        {user.role}
      </p>
      {SidebarData.map((data) => (
        <ul className="ms-4 mt-4" key={data.id}>
          <li className="nav-link">
            <Link
              className="text-decoration-none text-white"
              to={data.path}
              onClick={() => handleLogout(data.title)}
            >
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

  return (
    <BrowserRouter>
      {!token && <Navigate to="/login" />}
      <div className="row me-0">
        {token && (
          <div className="col-md-3">
            <Sidebar user={user} />
          </div>
        )}
        <div className={token ? "col-md-8" : "col-md-12"}>
          <Routes>
            <Route
              path="/login"
              element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/restaurants"
              element={token ? <Restaurants /> : <Navigate to="/login" />}
            />
            <Route
              path="/users"
              element={token ? <Users /> : <Navigate to="/login" />}
            />
            <Route
              path="/newlawyers"
              element={token ? <NewLawyers /> : <Navigate to="/login" />}
            />
            <Route
              path="/register"
              element={token ? <Registration /> : <Navigate to="/login" />}
            />
            <Route path="/error" element={<Error />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
