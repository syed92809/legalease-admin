const express = require("express");
const router = express.Router();

const {
  allRestaurants,
  getRestaurant,
  terminateRestaurant,
  dashboard,
  refund,
  getOrder,
  earnings,
  createDispute,
  disputes,
  resolve,
} = require("../controllers/adminController");

router.get("/restaurantsAdmin", allRestaurants);
router.get("/restaurantsAdmin/:id", getRestaurant);
router.post("/terminateAdmin/:id", terminateRestaurant);
router.get("/dashboardAdmin", dashboard);
router.post("/refundAdmin", refund);
router.post("/getOrderAdmin", getOrder);
router.get("/earningsAdmin", earnings);
router.post("/createDispute", createDispute);
router.get("/disputes", disputes);
router.put("/resolve/:id", resolve);
// router.put("/resetPasswordAdmin/:id", resetPassword);

module.exports = router;
