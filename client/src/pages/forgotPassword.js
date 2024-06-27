import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { url } from "./url";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/forgotPasswordAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === true) {
            setTimeout(() => {
              navigate("/otp", { state: { email: email } });
            }, 500);
          }
        });
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
          <Typography variant="p" gutterBottom className="text-secondary">
            Enter your email, if email is valid or account exists, we will send
            OTP to the email provided.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              color="primary"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" color="warning" fullWidth type="submit">
              Change Password
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
