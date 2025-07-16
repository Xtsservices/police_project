import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { apiGet } from "../../api";

const SuperAdminPatients = () => {
const [patients,setPatients] = useState([])
  const user = useSelector((state) => state.currentUserData);


  async function getPatients() {
    try {
        //pending
      const response = await apiGet("/dashboard/stats");
      console.log("responsestats", response);
      // Merge API response with default data to ensure all fields exist
      const data = response?.data?.data;
      if (data) {
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default data if API fails
      setDashboardData(defaultDashboardData);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getPatients();
    }
  }, [user]);

  return <div>SuperAdminPatients</div>;
};

export default SuperAdminPatients;
