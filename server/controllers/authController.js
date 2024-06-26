const bcrypt = require("bcrypt");
const pool = require("../database");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
// OTP Verification

let otp;
let admin_email;

const generateVerificationCode = () => {
  otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const signup = async (req, res) => {
  const { username, email, password, role } = req.body.user;

  // Check if the email is in the correct format
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use parameterized query to prevent SQL injection
    const signup_query =
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4)";
    const response = await pool.query(signup_query, [
      username,
      email,
      hashedPassword,
      role,
    ]);

    // console.log(response);
    res
      .status(200)
      .json({ success: true, message: "New role signed up successfully" });
  } catch (error) {
    console.error(error);
    // Check for unique constraint violation (email already exists)
    if (error.constraint === "admin_email_key") {
      res.status(409).json({
        success: false,
        message: "Email already exists, please try a different one.",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};
//************************************************************************************************************* */

//login route
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email is in the correct format
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  try {
    const user = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Send the user ID and Username in the response
    res.status(200).json({
      success: true,
      message: "Login successful, Redirecting",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nighthawk.og01@gmail.com",
    pass: "tpta hlig ljir bimr",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const user = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found!",
      });
    } else {
      admin_email = email;
      return res.status(200).json({
        success: true,
        email: email,
      });
      // console.log(otp);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { received_otp } = req.body;
  const converted_otp = parseInt(received_otp);
  if (converted_otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "OTP verification failed!",
    });
  } else {
    return res.status(200).json({
      success: true,
      email: admin_email,
    });
  }
};

// Send OTP
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const verificationCode = generateVerificationCode();
    // Mail options with the verification code
    const mailOptions = {
      from: ' "Verify Email" <nighthawk.og01@gmail.com> ',
      to: email,
      subject: "Only halal - Verify your email",
      html: `<h4> Your Verification Code : ${verificationCode} </h4>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: error.message,
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          success: true,
          message: "OTP sent",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//Resend OTP
const resendOTP = async (req, res) => {
  const verificationCode = generateVerificationCode();
  console.log(verificationCode, otp, admin_email);

  // Mail options with the verification code
  const mailOptions = {
    from: ' "Verify Email" <nighthawk.og01@gmail.com> ',
    to: admin_email,
    subject: "Only halal - Verify your email",
    html: `<h4> Your Verification Code : ${verificationCode} </h4>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({
        success: true,
        message: "Email sent",
        verificationCode,
        email: admin_email,
      });
    }
  });
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    await pool.query("UPDATE admin SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Check Password
const checkPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const findPassword = await pool.query("SELECT * FROM admin WHERE id = $1", [
      id,
    ]);
    const validPassword = await bcrypt.compare(
      password,
      findPassword.rows[0].password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Password Matched!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// Change Password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, password } = req.body;

  try {
    const findPassword = await pool.query("SELECT * FROM admin WHERE id = $1", [
      id,
    ]);
    const validPassword = await bcrypt.compare(
      oldPassword,
      findPassword.rows[0].password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatePassword = await pool.query(
        "UPDATE admin SET password = $1 WHERE id = $2",
        [hashedPassword, id]
      );
      return res.status(200).json({
        success: true,
        message: "Password Changed!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await pool.query("SELECT * FROM admin WHERE id = $1", [
      userId,
    ]);

    if (user.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "No user found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        user: user.rows[0],
      });
    }
  } catch (error) {}
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  sendOTP,
  resendOTP,
  resetPassword,
  checkPassword,
  changePassword,
  getUser,
};
