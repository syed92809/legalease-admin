import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Container, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./otp.css";
import { url } from "./url";

const OTP = ({ email, setIsVerified }) => {
  const [timer, setTimer] = useState(120);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/verifyOTPAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          received_otp: otp,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json.success === true) {
            setIsVerified(true);
            navigate("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    setTimer(120);
    setOtp("");
    try {
      fetch(`https://35.173.192.232/admin/resendOTPAdmin`, {
        method: "POST",
      }).then((res) => res.json());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`https://35.173.192.232/admin/sendOTPAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json));

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
        elevation={10}
        style={paperStyle}
        sx={{ border: "2px solid orange" }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Verification
          </Typography>
          <Typography className="text-secondary" variant="p">
            We have send you <strong>One Time Password</strong> to your Email{" "}
            <strong className="oh-primary">{email}</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                separator={<span>-</span>}
                inputStyle={{
                  width: "calc(100% / 6)",
                  textAlign: "center",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "2px solid #f8971d",
                  margin: "0px 10px",
                  padding: "4px 0px",
                  outline: "none",
                }}
                renderInput={(props) => <input {...props} />}
              />
              <div className="d-flex" style={{ marginTop: "30px" }}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  type="submit"
                >
                  Verify OTP
                </Button>
                {timer !== 0 ? (
                  <Button
                    onClick={handleResend}
                    disabled={timer !== 0}
                    style={{ marginLeft: "10px" }}
                  >
                    {formatTime(timer)}
                  </Button>
                ) : (
                  <Button
                    variant="body2"
                    className="border text-secondary"
                    onClick={handleResend}
                    style={{ marginLeft: "10px" }}
                  >
                    Resend
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default OTP;
