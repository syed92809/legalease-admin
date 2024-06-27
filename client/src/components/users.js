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
} from "@mui/material";
import { url } from "../pages/url";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // Number of rows per page

  useEffect(() => {
    fetch(`${url}/dashboardAdmin`)
      .then((res) => res.json())
      .then((json) => {
        const sortedUsers = json.users.sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
      });
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1); // Reset page to first page when search query changes
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toString().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate index of the first and last items for current page
  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <TableContainer
        component={Paper}
        elevation={3}
        variant="outined"
        style={{
          maxWidth: "800px",
          margin: "10% auto",
          maxHeight: "800px",
          color: "#404156",
        }}
        sx={{ border: "2px solid" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="ms-4 my-0">Users List</h3>
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
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((res) => (
              <TableRow key={res.id}>
                <TableCell align="center">{res.user_id}</TableCell>
                <TableCell align="center">{res.username}</TableCell>
                <TableCell align="center">{res.email}</TableCell>
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
    </div>
  );
};

export default Users;
