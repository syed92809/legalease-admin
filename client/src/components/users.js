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
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "client_information");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const username = `${user.firstName} ${user.lastName}`;
    return (
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Hold" ? "Approved" : "Hold";
    setLoading(true);
    try {
      const userDocRef = doc(db, "client_information", userId);
      await updateDoc(userDocRef, { account_status: newStatus });
      toast.success(`User account status updated to ${newStatus}`);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, account_status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user account status:", error);
      toast.error("Failed to update user account status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <CircularProgress />
      </Backdrop>
      <TableContainer
        component={Paper}
        variant="outlined"
        elevation={3}
        style={{ maxWidth: "800px", margin: "10% auto", maxHeight: "800px" }}
        sx={{ border: "2px solid" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="ms-4 my-0">Users</h3>
          <TextField
            label="Search User"
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
                Username
              </TableCell>
              <TableCell className="fw-bold" align="center">
                City
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Phone
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Account Status
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="center">{user.id}</TableCell>
                <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell align="center">{user.city}</TableCell>
                <TableCell align="center">{user.phone}</TableCell>
                <TableCell align="center">{user.account_status}</TableCell>
                <TableCell align="center">
                  <Button
                    color={user.account_status === "Hold" ? "primary" : "error"}
                    onClick={() => handleStatusChange(user.id, user.account_status)}
                  >
                    {user.account_status === "Hold" ? "Restore" : "Terminate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          count={Math.ceil(filteredUsers.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Users;
