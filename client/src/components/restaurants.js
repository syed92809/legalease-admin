import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TextField,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../pages/url";

const Modal = ({ selectedRestaurantId, handleCloseModal }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      if (!reason) {
        toast.error("Please, Write Reason!");
      } else {
        const response = await fetch(
          `${url}/terminateAdmin/${selectedRestaurantId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
          }
        );
        const data = await response.json();
        if (data.success === true) {
          toast.success("Restaurant Terminated");
          handleCloseModal();
        } else {
          throw new Error(data.message || "Failed to terminate restaurant");
        }
      }
    } catch (error) {
      console.error("Error terminating restaurant:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={true} onClose={handleCloseModal}>
      <DialogTitle>Terminate Restaurant</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to terminate this restaurant?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Reason"
          type="text"
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          type="submit"
        >
          Terminate
        </Button>
        <ToastContainer />
      </DialogActions>
    </Dialog>
  );
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showModel, setShowModel] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleCloseModal = () => {
    setShowModel(false);
    setSelectedRestaurantId(null);
  };

  useEffect(() => {
    fetch(`${url}/dashboardAdmin`)
      .then((res) => res.json())
      .then((json) => {
        const sortedRestaurants = json.restaurants;
        setRestaurants(sortedRestaurants);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to fetch restaurants");
      });
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const filteredRestaurants = restaurants.filter((res) => {
    return (
      res.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toString().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredRestaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <TableContainer
        component={Paper}
        variant="outlined"
        elevation={3}
        style={{ maxWidth: "800px", margin: "10% auto", maxHeight: "800px" }}
        sx={{ border: "2px solid orange" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="ms-4 my-0">Restaurants List</h3>
          <TextField
            label="Search Restaurant"
            variant="filled"
            color="warning"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="fw-bold" align="center">
                ID
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Restaurants
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Contact
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Orders
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Status
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((res) => (
              <TableRow key={res.id}>
                <TableCell align="center">{res.id}</TableCell>
                <TableCell align="center">{res.restaurant_name}</TableCell>
                <TableCell align="center">{res.contact_details}</TableCell>
                <TableCell align="center">{res.orders}</TableCell>
                <TableCell
                  align="center"
                  className={`${
                    res.terminate === false ? "text-success" : "text-danger"
                  } text-center fw-bold`}
                >
                  {res.terminate === false ? "Running" : "Terminated"}
                </TableCell>
                <TableCell align="center">
                  {res.terminate === false && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        setSelectedRestaurantId(res.id);
                        setShowModel(true);
                      }}
                    >
                      Terminate
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          count={Math.ceil(filteredRestaurants.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
      {showModel && (
        <Modal
          selectedRestaurantId={selectedRestaurantId}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Restaurants;
