import React, { useEffect, useState } from "react";
import { FaUser, FaDollarSign, FaBalanceScale, FaAtlas } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Updated import for Firestore

const Dashboard = () => {
  const [count, setCount] = useState({
    revenu: 0,
    lawyers: 0,
    users: 0,
    services: 0,
  });
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const db = getFirestore(); // Use the imported Firestore instance

        const lawyersSnapshot = await getDocs(collection(db, "lawyers_information"));
        const usersSnapshot = await getDocs(collection(db, "client_information"));
        const servicesSnapshot = await getDocs(collection(db, "contract_information"));

        setCount({
          revenu: 0, // Revenue will be handled separately
          lawyers: lawyersSnapshot.size,
          users: usersSnapshot.size,
          services: servicesSnapshot.size,
        });

        console.log("Fetched counts:", {
          lawyers: lawyersSnapshot.size,
          users: usersSnapshot.size,
          services: servicesSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching counts from Firestore:", error);
      }
    };
    fetchCounts();
  }, []);

  console.log("Earnings state:", earnings);

  return (
    <div className="container mt-5">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <FaDollarSign color="#404156" size={38} />
            <div className="ms-3">
              <p className="mb-0">Revenue</p>
              <h4 className="text-secondary">${count.revenu}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <FaBalanceScale style={{ fontWeight: 600 }} color="#404156" size={38} />
            <div className="ms-3">
              <p className="mb-0">Lawyers</p>
              <h4 className="text-secondary">{count.lawyers}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <FaUser color="#404156" size={38} />
            <div className="ms-3">
              <p className="mb-0">Users</p>
              <h4 className="text-secondary">{count.users}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <FaAtlas color="#404156" size={38} />
            <div className="ms-3">
              <p className="mb-0">Contracts</p>
              <h4 className="text-secondary">{count.services}</h4>
            </div>
          </div>
        </div>
        <div className="mt-5" style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={earnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#404156" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
