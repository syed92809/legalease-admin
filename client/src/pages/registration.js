import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path is correct
// service_2udt1xm

const Registration = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin", // default role as admin
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      if (!user.firstname) {
        toast.error("Please, enter First Name");
      } else if (!user.lastname) {
        toast.error("Please, enter Last Name");
      } else if (!user.email) {
        toast.error("Please, enter Email");
      } else if (!user.password) {
        toast.error("Please, enter Password");
      } else if (user.confirmPassword !== user.password) {
        toast.error("Password does not match");
      } else {
        // Create user with Firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const uid = userCredential.user.uid;

        // Save additional user info to Firestore
        await setDoc(doc(db, "admin", uid), {
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        });

        toast.success("New Admin Added");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to register user");
    }

    setUser({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    });
  };

  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 350,
    margin: "40px auto",
    color: "#404156",
  };

  return (
    <Container maxWidth="xs">
      <Paper
        variant="outlined"
        elevation={10}
        style={paperStyle}
        sx={{ border: "2px solid" }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Add New Admin
          </Typography>
          <form onSubmit={handleSignUp}>
            <TextField
              label="First Name"
              variant="outlined"
              margin="normal"
              fullWidth
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              color="primary"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              margin="normal"
              fullWidth
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              color="primary"
            />
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              name="email"
              value={user.email}
              onChange={handleChange}
              color="primary"
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
              color="primary"
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
              color="primary"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Create Admin
            </Button>
            <ToastContainer />
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default Registration;
