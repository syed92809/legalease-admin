import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { url } from "./url";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const id = localStorage.getItem("id");
  console.log(id);

  const handlePassword = (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        console.log("Password doesn't match!");
      } else {
        fetch(`${url}/changePasswordAdmin/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            password: newPassword,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            navigate("/refund");
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
  };

  return (
    <Container maxWidth="xs">
      <Paper
        variant="outlined"
        elevation={10}
        style={paperStyle}
        sx={{ border: "2px solid orange" }}
      >
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
          <TextField
            label="Old Password"
            type="password"
            variant="outlined"
            color="warning"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            color="warning"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            color="warning"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={handlePassword}
            style={{ marginTop: "10px" }}
          >
            Change Password
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
