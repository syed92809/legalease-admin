import React, { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "./url";

const Refund = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    currentAmount: "",
    refundAmount: "",
    refundDate: "",
    expiryDate: "",
  });
  const [order, setOrder] = useState({
    orderId: null,
    user: {
      id: null,
      name: "",
      email: "",
    },
    items: [],
    orderDate: "",
    amount: null,
    status: null,
  });
  const [orderId, setOrderId] = useState("");

  const fetchOrder = (e) => {
    e.preventDefault();
    fetch(`${url}/getOrderAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setOrder({
          orderId: json.orderId,
          user: {
            id: json.user.user_id,
            name: json.user.name,
            email: json.user.email,
          },
          items: json.items,
          orderDate: json.orderDate,
          amount: json.amount,
          status: json.status,
        });
        setFormData({
          ...formData,
          userEmail: json.user.email,
          currentAmount: json.amount,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      if (!formData.currentAmount) {
        toast.error("Please Select Customer ID!");
      } else if (!formData.refundAmount) {
        toast.error("Please Enter Refund ammount!");
      }
      if (!(formData.currentAmount >= formData.refundAmount)) {
        toast.error("Refund ammount exceeds the current ammount");
      } else {
        fetch(`https://35.173.192.232/admin/refundAdmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success === true) {
              toast.success("Ammount Refunded!");
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center my-3">Order</h3>
      <form onSubmit={fetchOrder}>
        <Grid container spacing={2} alignItems={"center"}>
          <Grid item xs={12} sm={11}>
            <TextField
              fullWidth
              label="Order ID"
              color="primary"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" color="primary" type="submit">
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
      {order.user.id !== null && (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ maxWidth: "800px", margin: "20px auto", maxHeight: "800px" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold" align="center">
                  ID
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  User
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  Email
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  Items
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  Amount
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  Date
                </TableCell>
                <TableCell className="fw-bold" align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{order.orderId}</TableCell>
                <TableCell align="center">{order.user.name}</TableCell>
                <TableCell align="center">{order.user.email}</TableCell>
                <TableCell align="center">
                  {order.items.map((item) => {
                    return (
                      <div key={item.id}>
                        <p>
                          <span>{item.quantity}x</span>&nbsp;
                          <strong>{item.food_name}</strong>
                        </p>
                      </div>
                    );
                  })}
                </TableCell>
                <TableCell align="center">${order.amount}</TableCell>
                <TableCell align="center">{order.orderDate}</TableCell>
                <TableCell
                  align="center"
                  className={`${
                    order.status === 5 ? "text-success" : "text-danger"
                  } text-center fw-bold`}
                >
                  {order.status === 5 ? "Completed" : "Not Completed"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <h3 className="text-center my-3">Refund</h3>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="User Email"
              name="userEmail"
              color="primary"
              type="email"
              value={formData.userEmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Amount"
              name="currentAmount"
              color="primary"
              value={formData.currentAmount}
              onChange={handleChange}
              disabled
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Refund Amount"
              name="refundAmount"
              color="primary"
              value={formData.refundAmount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Refund Date"
              type="date"
              name="refundDate"
              color="primary"
              value={formData.refundDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              name="expiryDate"
              color="primary"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Refund
            </Button>
            <ToastContainer s />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Refund;
