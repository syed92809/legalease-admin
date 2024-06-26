import React, { useEffect, useState } from "react";
import { FaUser, FaDollarSign } from "react-icons/fa";
import { IoRestaurantSharp } from "react-icons/io5";
import { BiSolidDish } from "react-icons/bi";
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
    restaurants: 0,
    users: 0,
    orders: 0,
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
          restaurants: json.restaurantCount,
          users: json.userCount,
          orders: json.orders,
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
            <FaDollarSign color="#f8971d" size={38} />
            <div className="ms-3">
              <p className="mb-0">Revenue</p>
              <h4 className="text-secondary">${count.revenu}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <IoRestaurantSharp color="#f8971d" size={38} />
            <div className="ms-3">
              <p className="mb-0">Restaurants</p>
              <h4 className="text-secondary">{count.restaurants}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <FaUser color="#f8971d" size={38} />
            <div className="ms-3">
              <p className="mb-0">Users</p>
              <h4 className="text-secondary">{count.users}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4 shadow-sm rounded rounded-3 d-flex align-items-center">
            <BiSolidDish color="#f8971d" size={38} />
            <div className="ms-3">
              <p className="mb-0">Orders</p>
              <h4 className="text-secondary">{count.orders}</h4>
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
                stroke="#F8971D"
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
