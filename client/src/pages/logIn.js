import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import OTP from "./otp";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { url } from "./url";

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

  const handleLogIn = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/loginAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === true) {
            Cookies.set("token", json.token, { expires: 1 });
            toast.success(json.message);
            setTimeout(() => {
              setIsLoggedIn(true);
              navigate("/");
            }, 2000);
          }
        });
    } catch (error) {
      toast.error(error);
    }
  };

  const paperStyle = {
    height: "auto",
    width: 350,
    margin: "25% auto",
    padding: 20,
    textAlign: "center",
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="xs">
        <Paper
          variant="outlined"
          elevation={10}
          style={paperStyle}
          sx={{ border: "3px solid orange" }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Log In
            </Typography>
            <form onSubmit={handleLogIn}>
              <TextField
                label="Email"
                variant="outlined"
                color="warning"
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
                color="warning"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                color="warning"
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
