import React, { useEffect, useState } from "react";
import { FaUser, FaDollarSign } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { FaAtlas } from "react-icons/fa";
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
import { url } from "./url";

const Dashboard = () => {
  const [count, setCount] = useState({
    revenu: 0,
    lawyers: 0,
    users: 0,
    services: 0,
  });
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch(`${url}/earningsAdmin`);
        if (!response.ok) {
          throw new Error("Failed to fetch earnings");
        }
        const data = await response.json();
        setEarnings(data);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };
    fetch(`${url}/dashboardAdmin`)
      .then((res) => res.json())
      .then((json) =>
        setCount({
          revenu: json.earning,
          lawyers: json.restaurantCount,
          users: json.userCount,
          services: json.services,
        })
      );
    fetchEarnings();
  }, []);

  console.log(earnings);

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
            <FaBalanceScale
              style={{ fontWeight: 600 }}
              color="#404156"
              size={38}
            />
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
              <p className="mb-0">Services</p>
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#404156"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
