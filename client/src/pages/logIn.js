import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from '../firebase'; // Import Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LogIn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkCookie = async () => {
      const token = await Cookies.get("token");
      if (token) {
        navigate("/");
      }
    };
    checkCookie();
  }, [navigate]);

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user document from Firestore
      const userDoc = await getDoc(doc(db, "admin", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        Cookies.set("token", user.accessToken, { expires: 1 });
        toast.success("Login successfull !");
        setIsLoggedIn(true);
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Invalid credentials provided");
    }
  };

  const paperStyle = {
    height: "auto",
    width: 350,
    margin: "25% auto",
    padding: 20,
    textAlign: "center",
    color: "#404156",
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="xs">
        <Paper
          variant="outlined"
          elevation={10}
          style={paperStyle}
          sx={{ border: "3px solid" }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Log In
            </Typography>
            <form onSubmit={handleLogIn}>
              <TextField
                label="Email"
                variant="outlined"
                color="primary"
                fullWidth
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                type="submit"
                style={{ marginTop: "20px" }}
              >
                Log In
              </Button>
              <Button
                variant="body2"
                color="textSecondary"
                style={{
                  marginTop: "10px",
                  textAlign: "right",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/forgotPassword")}
              >
                Forgot Password?
              </Button>
            </form>
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default LogIn;
