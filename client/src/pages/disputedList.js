import React, { useEffect, useState } from "react";
import "./dispute.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import ScrollToBottom from "react-scroll-to-bottom";
import "../components/disputeChat.css";
import moment from "moment";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { url } from "./url";

const Modal = ({ disputeId, handleCloseModal }) => {
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!remarks) {
        toast.error("Please write your remakrs!");
      } else {
        // console.log(disputeId);
        const response = await fetch(`${url}/resolve/${disputeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ remarks: remarks, status: status }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success === true) {
              toast.success(json.message);
            } else {
              toast.error(json.message);
            }
          });
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error resolving complain:", error);
    }
  };

  return (
    <Dialog open={true} onClose={handleCloseModal}>
      <div style={{ width: 400 }}>
        <DialogTitle>Resolve</DialogTitle>
        <DialogContent>
          <DialogContentText>Write your remarks.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason"
            type="text"
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <div className="d-flex justify-content-between align-items-cetner">
            <DialogContentText>
              Give payment to the restaurant ?
            </DialogContentText>
            <input
              type="checkbox"
              value={status}
              onChange={() => setStatus(!status)}
              style={{ border: "none" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            type="submit"
          >
            Submit
          </Button>
          <ToastContainer />
        </DialogActions>
      </div>
    </Dialog>
  );
};

const DisputedList = ({ admin_name }) => {
  const [openCards, setOpenCards] = useState({});
  const [chats, setChats] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [disputeId, setDisputeId] = useState(null);

  const handleCloseModal = () => {
    setShowModel(false);
    setDisputeId(null);
  };

  useEffect(() => {
    fetch(`${url}/disputes`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.disputes)) {
          setDisputes(json.disputes);
        } else {
          console.error("Invalid data format: disputes not found in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching disputes:", error);
      });
  }, []);

  const toggleAccordion = (id) => {
    setOpenCards((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    if (!openCards[id]) {
      fetch(`${url}/chats/${id}`)
        .then((getChats) => getChats.json())
        .then((data) => {
          if (Array.isArray(data.chats)) {
            setChats(data.chats);
          } else {
            console.error("Invalid data format: chats not found in response");
          }
        })
        .catch((error) => {
          console.error("Error fetching chats:", error);
        });
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const orderId = String(dispute.orderId);
    return (
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row justify-content-center align-items-end">
        <div className="col-md-6">
          <input
            className="form-control"
            type="text"
            name="search"
            placeholder="Order ID or Customer E-mail"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="border border-1 rounded-2 p-3 mt-2 overflow-y-auto"
            style={{ borderColor: "#f8971d", height: 500 }}
          >
            {filteredDisputes.map((data) => (
              <div className="card mb-2" key={data.orderId}>
                <h2 className="card-header">
                  <button
                    className="accordion-button"
                    onClick={() => toggleAccordion(data.chat_id)}
                    type="button"
                  >
                    <p className="fs-5 my-0">{data.dispute}</p>
                  </button>
                </h2>
                <div
                  className="card-body py-0 card-toggle"
                  style={{
                    height: openCards[data.chat_id] ? "auto" : 30,
                    overflow: openCards[data.chat_id] ? "visible" : "hidden",
                  }}
                >
                  {!openCards[data.chat_id] && (
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="my-1">
                        <strong>Order# </strong>
                        {data.orderId}
                      </p>
                      <p className="my-1">
                        <strong>Date: </strong>
                        {data.date.split("T")[0]}
                      </p>
                    </div>
                  )}
                  {openCards[data.chat_id] && (
                    <>
                      <p className="my-1">
                        <strong>Order# </strong>
                        {data.orderId}
                      </p>
                      <p className="my-1">
                        <strong>Date: </strong>
                        {data.date.split("T")[0]}
                      </p>
                      <p className="my-1">
                        <strong>Customer: </strong>
                        {data.username}
                      </p>
                      <p className="my-1">
                        <strong>Customer E-mail: </strong>
                        {data.email}
                      </p>
                      <p className="my-1">
                        <strong>CSR: </strong>
                        {data.csr}
                      </p>
                      <p className="my-1">
                        <strong>Restaurant: </strong>
                        {data.restaurant.restaurant_name}
                      </p>
                      <p className="my-1">
                        <strong>Branch: </strong>
                        {data.restaurant.branches}
                      </p>
                      <p className="my-1">
                        <strong>Contact: </strong>
                        {data.restaurant.contact_details}
                      </p>
                      <p className="my-1">
                        <strong>Food</strong>
                        {data.items.map((item) => (
                          <ul className="my-0" key={item.id}>
                            <li>
                              {item.quantity}x&nbsp;{item.food_name}
                            </li>
                          </ul>
                        ))}
                      </p>
                      <p className="my-1">
                        <strong>Order Date: </strong>
                        {data.order_date.split("T")[0]}
                      </p>
                      <p className="my-1">
                        <strong>Total Amount: </strong>${data.total}
                      </p>
                      <p className="my-1">
                        <strong>Refund: </strong>${data.refund_amount}
                      </p>
                      <button
                        type="button"
                        className="btn btn-success w-100 mb-2"
                        onClick={() => {
                          setDisputeId(data.id);
                          setShowModel(true);
                        }}
                      >
                        Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="w-100">
            <div
              className={chats.length > 0 && chats[0].username ? "p-2" : ""}
              style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)" }}
            >
              <h4 className="text-center">
                {chats.length > 0 && chats[0].username ? chats[0].username : ""}
              </h4>
            </div>

            <ScrollToBottom className="chat-container rounded-3 border border-1 pb-2">
              <div className="chat-messages">
                {chats.map((chat, index) => (
                  <div
                    className={`message ${
                      chat.sender === admin_name ? "sender" : "receiver"
                    }`}
                    key={index}
                  >
                    <p className="message-text">{chat.message}</p>
                    <span className="message-time">
                      {moment(`1970-01-01 ${chat.time}`).format("hh:mm A")}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollToBottom>
          </div>
        </div>
      </div>
      {showModel && (
        <Modal disputeId={disputeId} handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

export default DisputedList;
