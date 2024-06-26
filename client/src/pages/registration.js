import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "./url";

const Registration = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // console.log(user);
    try {
      if (!user.password) {
        toast.error("Please, write Username");
      } else if (!user.email) {
        toast.error("Please, write Email");
      } else if (!user.password) {
        toast.error("Please, write Password");
      } else if (user.confirmPassword !== user.password) {
        toast.error("Password does not match");
      } else if (!user.role) {
        toast.error("Please, write role");
      } else {
        fetch(`${url}/signupAdmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success === true) {
              toast.success("New Role Added");
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
    setUser({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 350,
    margin: "40px auto",
  };

  return (
    <Container maxWidth="xs">
      <Paper
        variant="outlined"
        elevation={10}
        style={paperStyle}
        sx={{ border: "2px solid orange" }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Registration
          </Typography>
          <form onSubmit={handleSignUp}>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              name="username"
              value={user.username}
              onChange={handleChange}
              color="warning"
            />
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              name="email"
              value={user.email}
              onChange={handleChange}
              color="warning"
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              value={user.password}
              onChange={handleChange}
              color="warning"
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              color="warning"
            />
            <TextField
              label="Role"
              variant="outlined"
              margin="normal"
              fullWidth
              name="role"
              value={user.role}
              onChange={handleChange}
              color="warning"
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Register
            </Button>
            <ToastContainer s />
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default Registration;
