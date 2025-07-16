import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import AppRoutes from "./AppRoutes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { apiGet } from "./components/api";
import { useNavigate } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.currentUserData);
  const hasFetchedUser = useRef(false);
  const getToken = () => localStorage.getItem("accessToken");
  const getRole = () => localStorage.getItem("role");

  const getCurrentUserData = async () => {
    try {
      console.log("startapi");
      // http://localhost:3100/api/patient-auth/myProfile
      const role = getRole();
      const endpoint =
        role !== "patient" ? "/auth/myProfile" : "patient-auth/myProfile";
      const response = await apiGet(endpoint);
      let userData;
      if (role == "patient") {
        userData = response.data?.data;
      } else {
        userData = response.data?.data?.user;
      }
      console.log("userDatafrom app.jsx", response);
      if (userData) {
        dispatch({
          type: "currentUserData",
          payload: userData,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
      console.log(
        error.response?.data?.message,
        "error.response?.data?.message"
      );
      if (error.response?.data?.message === "Invalid or expired session") {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    console.log(getToken(), "token");
    if (getToken() && !user && !hasFetchedUser.current) {
      hasFetchedUser.current = true; // ✅ Prevent future fetch attempts
      getCurrentUserData();
    }
  }, [user]);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
