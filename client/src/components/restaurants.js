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
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLawyers = async () => {
      const lawyersCollection = collection(db, "lawyers_information");
      const lawyersSnapshot = await getDocs(lawyersCollection);
      const lawyersData = [];

      for (const lawyerDoc of lawyersSnapshot.docs) {
        const lawyerData = lawyerDoc.data();
        const lawyerStatsDoc = await getDoc(doc(db, "lawyer_stats", lawyerDoc.id));
        const lawyerStatsData = lawyerStatsDoc.exists() ? lawyerStatsDoc.data() : {};

        lawyersData.push({
          id: lawyerDoc.id,
          name: `${lawyerData.firstName} ${lawyerData.lastName}`,
          phone: lawyerData.phone,
          rating: lawyerStatsData.average_rating || "N/A",
          cases: lawyerStatsData.total_cases || "N/A",
          account_status: lawyerData.account_status || "Approved", // Default to Approved if not set
        });
      }

      setLawyers(lawyersData);
    };

    fetchLawyers();
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    return (
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredLawyers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTerminateClick = async (lawyerId, currentStatus) => {
    const newStatus = currentStatus === "Hold" ? "Approved" : "Hold";
    setLoading(true);
    try {
      const lawyerDocRef = doc(db, "lawyers_information", lawyerId);
      await updateDoc(lawyerDocRef, { account_status: newStatus });
      toast.success(`Lawyer account status updated to ${newStatus}`);
      
      // Update the local state to reflect the change
      setLawyers((prevLawyers) =>
        prevLawyers.map((lawyer) =>
          lawyer.id === lawyerId ? { ...lawyer, account_status: newStatus } : lawyer
        )
      );
    } catch (error) {
      console.error("Error updating lawyer account status:", error);
      toast.error("Failed to update lawyer account status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TableContainer
        component={Paper}
        variant="outlined"
        elevation={3}
        style={{ maxWidth: "800px", margin: "10% auto", maxHeight: "800px" }}
        sx={{ border: "2px solid" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="ms-4 my-0">Lawyers</h3>
          <TextField
            label="Search Lawyers"
            variant="filled"
            color="primary"
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
                Name
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Phone
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Rating
              </TableCell>
              <TableCell className="fw-bold" align="center">
                Cases
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
            {currentItems.map((lawyer) => (
              <TableRow key={lawyer.id}>
                <TableCell align="center">{lawyer.id}</TableCell>
                <TableCell align="center">{lawyer.name}</TableCell>
                <TableCell align="center">{lawyer.phone}</TableCell>
                <TableCell align="center">{lawyer.rating}</TableCell>
                <TableCell align="center">{lawyer.cases}</TableCell>
                <TableCell align="center">{lawyer.account_status}</TableCell>
                <TableCell align="center">
                  <Button
                    color={lawyer.account_status === "Hold" ? "primary" : "error"}
                    onClick={() => handleTerminateClick(lawyer.id, lawyer.account_status)}
                    disabled={loading}
                  >
                    {lawyer.account_status === "Hold" ? "Restore" : "Terminate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          count={Math.ceil(filteredLawyers.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <ToastContainer />
      <Backdrop open={loading} style={{ zIndex: 1000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Lawyers;
