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
import Modal from 'react-modal';
import './NewLawyers.css'; // Make sure to import a CSS file for custom styles

const NewLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      const lawyersCollection = collection(db, "lawyers_information");
      const lawyersSnapshot = await getDocs(lawyersCollection);
      const lawyersData = lawyersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((lawyer) => lawyer.account_status === "Hold");
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
    const lawyerName = `${lawyer.firstName} ${lawyer.lastName}`;
    return (
      lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredLawyers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApproveAccount = async (lawyerId) => {
    setLoading(true);
    try {
      const lawyerDocRef = doc(db, "lawyers_information", lawyerId);
      await updateDoc(lawyerDocRef, { account_status: "Approved" });
      toast.success("Lawyer account status updated to Approved");

      setLawyers((prevLawyers) =>
        prevLawyers.map((lawyer) =>
          lawyer.id === lawyerId ? { ...lawyer, account_status: "Approved" } : lawyer
        )
      );
    } catch (error) {
      console.error("Error updating lawyer account status:", error);
      toast.error("Failed to update lawyer account status");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className={modalIsOpen ? 'modal-open' : ''}>
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
          <h3 className="ms-4 my-0">New Lawyers</h3>
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
              <TableCell className="fw-bold" align="center">ID</TableCell>
              <TableCell className="fw-bold" align="center">Name</TableCell>
              <TableCell className="fw-bold" align="center">Phone</TableCell>
              <TableCell className="fw-bold" align="center">City</TableCell>
              <TableCell className="fw-bold" align="center">Country</TableCell>
              <TableCell className="fw-bold" align="center">Degree</TableCell>
              <TableCell className="fw-bold" align="center">High Price</TableCell>
              <TableCell className="fw-bold" align="center">Low Price</TableCell>
              <TableCell className="fw-bold" align="center">Account Status</TableCell>
              <TableCell className="fw-bold" align="center">Lawyer Image</TableCell>
              <TableCell className="fw-bold" align="center">License Image</TableCell>
              <TableCell className="fw-bold" align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((lawyer) => (
              <TableRow key={lawyer.id}>
                <TableCell align="center">{lawyer.id}</TableCell>
                <TableCell align="center">{`${lawyer.firstName} ${lawyer.lastName}`}</TableCell>
                <TableCell align="center">{lawyer.phone}</TableCell>
                <TableCell align="center">{lawyer.city}</TableCell>
                <TableCell align="center">{lawyer.country}</TableCell>
                <TableCell align="center">{lawyer.degree}</TableCell>
                <TableCell align="center">{lawyer.highPrice}</TableCell>
                <TableCell align="center">{lawyer.lowPrice}</TableCell>
                <TableCell align="center">{lawyer.account_status}</TableCell>
                <TableCell align="center">
                  <img 
                    src={lawyer.imageUrl} 
                    alt="Lawyer" 
                    style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }} 
                    onClick={() => openModal(lawyer.imageUrl)}
                  />
                </TableCell>
                <TableCell align="center">
                  <img 
                    src={lawyer.License} 
                    alt="License" 
                    style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }} 
                    onClick={() => openModal(lawyer.License)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="primary"
                    onClick={() => handleApproveAccount(lawyer.id)}
                    disabled={lawyer.account_status === "Approved" || loading}
                  >
                    Approve Account
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            top: '50%',
            left: '70%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <img src={selectedImage} alt="Selected" style={{ width: "60%", height: "60%" }} />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default NewLawyers;
