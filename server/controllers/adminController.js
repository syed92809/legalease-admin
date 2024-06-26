const pool = require("../database");
const nodemailer = require("nodemailer");

// Get Restaurants
const allRestaurants = async (req, res) => {
  const response = await pool.query("SELECT * FROM restaurants");
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "No Restaurants are found!",
    });
  } else {
    return res.status(200).json({
      restaurants: response.rows,
    });
  }
};

// Single Restaurant
const getRestaurant = async (req, res) => {
  const { id } = await req.params;
  const response = await pool.query("SELECT * FROM restaurants WHERE id = $1", [
    id,
  ]);
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "No Restaurants are found!",
    });
  } else {
    return res.status(200).json({
      restaurant: response.rows[0],
    });
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

const terminateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
  const day = date.getDate();
  const currentDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  try {
    const checkTermination = await pool.query(
      "SELECT * FROM restaurants WHERE id = $1",
      [id]
    );
    // console.log(checkTermination.rows[0].terminate);
    if (checkTermination.rows[0].terminate !== true) {
      const removeRestaurant = await pool.query(
        "UPDATE restaurants SET terminate = $1 WHERE id = $2",
        [true, id]
      );

      const mailOptions = {
        from: ' "Only Halal" <nighthawk.og01@gmail.com> ',
        to: "nighthawk.og01@gmail.com",
        subject: "Only halal - Restaurant Termination",
        html: `<h4> Your Restaurant has been terminated due to violation of Terms & Agreement.</h4>`,
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
          });
        }
      });

      const addToList = await pool.query(
        "INSERT INTO deleted_restaurants (restaurant_id, reason, date) VALUES ($1, $2, $3)",
        [id, reason, currentDate]
      );
      return res.status(404).json({
        success: true,
        message: "Restaurant terminated Successfully",
      });
    } else {
      return res
        .status(200)
        .json({ message: "Restaurant already terminated!" });
    }
  } catch (error) {
    console.log(error);
  }
};

const dashboard = async (req, res) => {
  try {
    const getUsers = await pool.query(
      "SELECT user_id, username, email FROM users"
    );
    const getRestaurants = await pool.query(`
  SELECT
    r.id,
    r.restaurant_name,
    r.contact_details,
    r.location,
    r.branches,
    r.cover,
    r.res_user_id,
    r.working_hours,
    r.email,
    r.terminate,
    COUNT(DISTINCT o.id) AS orders
  FROM
    restaurants r
  LEFT JOIN
    orders o ON r.id = o.restaurant_id
  WHERE
    r.terminate = true
  GROUP BY
    r.id,
    r.restaurant_name,
    r.contact_details,
    r.location,
    r.branches,
    r.cover,
    r.res_user_id,
    r.working_hours,
    r.email,
    r.terminate;
`);

    const getEarning = await pool.query("SELECT * FROM admin_wallet");
    const orders = await pool.query("SELECT * FROM orders");

    return res.status(200).json({
      users: getUsers.rows,
      restaurants: getRestaurants.rows,
      userCount: getUsers.rowCount,
      restaurantCount: getRestaurants.rowCount,
      earning: getEarning.rows[0].balance,
      orders: orders.rowCount,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get Order
const getOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [
    orderId,
  ]);
  if (order.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: "No Order Found!",
    });
  }
  const userId = order.rows[0].user_id;
  const user = await pool.query(
    "SELECT user_id,username, email FROM users WHERE user_id = $1",
    [userId]
  );

  const orderItems = await pool.query(
    "SELECT item_order.id, item_order.quantity, restaurant_menu.food_name FROM item_order JOIN restaurant_menu ON item_order.item_id = restaurant_menu.id WHERE item_order.order_id = $1",
    [orderId]
  );

  return res.status(200).json({
    orderId: orderId,
    user: {
      id: user.rows[0].user_id,
      name: user.rows[0].username,
      email: user.rows[0].email,
    },
    items: orderItems.rows,
    orderDate: order.rows[0].order_date.toString().split(" 00:00:00")[0],
    amount: order.rows[0].total,
    status: order.rows[0].status,
  });
};

// Refund
const refund = async (req, res) => {
  const { userEmail, currentAmount, refundAmount, refundDate, expiryDate } =
    req.body.formData;
  try {
    const getUser = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [userEmail]
    );
    if (getUser.rowCount !== 0) {
      const addRefund = await pool.query(
        "INSERT INTO wallet (refunddate, expirydate, refundamount, current_amount, user_id, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          refundDate,
          expiryDate,
          refundAmount,
          currentAmount,
          getUser.rows[0].user_id,
          "valid",
        ]
      );
      return res.status(200).json({
        success: true,
        message: "Amount Refunded!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const earnings = async (req, res) => {
  // const { date, amount } = req.body;
  try {
    // const result = await pool.query(
    //   "INSERT INTO earnings (date, amount) VALUES ($1, $2) RETURNING *",
    //   [date, amount]
    // );
    const result = await pool.query("SELECT date, amount FROM earnings");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error saving earning:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createDispute = async (req, res) => {
  const { id, email } = req.body;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const chat_room = await pool.query(
      "SELECT id FROM chat_room WHERE room_id = $1",
      [user.rows[0].user_id]
    );
    const date = new Date();

    const dispute = await pool.query(
      "INSERT INTO disputes (order_id, chat_id, date) VALUES ($1, $2, $3)",
      [order.rows[0].id, chat_room.rows[0].id, date]
    );
    return res.status(201).json(dispute.rows[0]);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

const disputes = async (req, res) => {
  try {
    const disputesData = await pool.query(
      "SELECT * FROM disputes WHERE status = 0"
    );

    if (disputesData.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No dispute found!",
      });
    }

    const disputesFormatted = [];

    for (const dispute of disputesData.rows) {
      const order = await pool.query("SELECT * FROM orders WHERE id = $1", [
        dispute.order_id,
      ]);
      const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
        order.rows[0].user_id,
      ]);
      const wallet = await pool.query(
        "SELECT * FROM wallet WHERE user_id = $1",
        [user.rows[0].user_id]
      );
      const restaurant = await pool.query(
        "SELECT * FROM restaurants WHERE id = $1",
        [order.rows[0].restaurant_id]
      );
      const items = await pool.query(
        "SELECT io.item_id, io.quantity, rm.food_name FROM item_order io JOIN restaurant_menu rm ON io.item_id = rm.id WHERE io.order_id = $1",
        [order.rows[0].id]
      );

      const formattedDispute = {
        id: dispute.id,
        dispute: dispute.dispute,
        date: dispute.date,
        csr: dispute.csr,
        orderId: order.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        items: items.rows.map((item) => ({
          id: item.item_id,
          food_name: item.food_name,
          quantity: item.quantity,
        })),
        total: order.rows[0].total,
        order_date: order.rows[0].order_date,
        refund_amount: dispute.refund_amount,
        restaurant: {
          restaurant_name: restaurant.rows[0].restaurant_name,
          contact_details: restaurant.rows[0].contact_details,
          branches: restaurant.rows[0].branches,
        },
        chat_id: dispute.chat_id,
      };

      disputesFormatted.push(formattedDispute);
    }

    return res.status(200).json({
      success: true,
      disputes: disputesFormatted,
    });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

const resolve = async (req, res) => {
  const { remarks, status } = req.body;
  const { id } = req.params;

  try {
    if (status === true) {
      const update = await pool.query(
        "UPDATE disputes SET remarks = $1, status = $2 WHERE id = $3 RETURNING *",
        [remarks, 1, id]
      );
      console.log(update.rows[0]);
      const res_wallet = await pool.query(
        "UPDATE res_wallet SET status = $1 WHERE order_id = $2 RETURNING *",
        [1, update.rows[0].order_id]
      );
    } else {
      const update = await pool.query(
        "UPDATE disputes SET remarks = $1, status = $2 WHERE id = $3 RETURNING *",
        [remarks, 2, id]
      );
      const res_wallet = await pool.query(
        "UPDATE res_wallet SET status = $1 WHERE order_id = $2 RETURNING *",
        [3, update.rows[0].order_id]
      );
      const admin_wallet = await pool.query(
        "UPDATE admin_wallet SET balance = balance + $1 WHERE id = $2",
        [res_wallet.rows[0].balance, 1]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Complain has been resolved!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error",
    });
  }
};

module.exports = {
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
};
