import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { url } from "./url";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state !== null ? location.state : "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log(email);

  const handlePassword = (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        console.log("Password doesn't match!");
      } else {
        fetch(`${url}/resetPasswordAdmin`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: newPassword,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            navigate("/login");
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 350,
    margin: "25% auto",
    color: "#404156",
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} style={paperStyle} sx={{ border: "2px solid" }}>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Reset Password
          </Typography>
          <form onSubmit={handlePassword}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              color="primary"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              color="primary"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Change Password
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
