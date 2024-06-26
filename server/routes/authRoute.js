const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  sendOTP,
  verifyOTP,
  resendOTP,
  resetPassword,
  checkPassword,
  changePassword,
  getUser,
} = require("../controllers/authController");

router.post("/signupAdmin", signup);
router.post("/loginAdmin", login);
router.post("/forgotPasswordAdmin", forgotPassword);
router.post("/sendOTPAdmin", sendOTP);
router.post("/verifyOTPAdmin", verifyOTP);
router.post("/resendOTPAdmin", resendOTP);
router.put("/resetPasswordAdmin", resetPassword);
router.post("/checkPasswordAdmin/:id", checkPassword);
router.put("/changePasswordAdmin/:id", changePassword);
router.get("/getUserAdmin/:userId", getUser);

module.exports = router;
