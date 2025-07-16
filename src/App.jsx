import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import AppRoutes from "./AppRoutes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { apiGet } from "./components/api";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUserData);
  const hasFetchedUser = useRef(false);
  const getToken = () => localStorage.getItem("accessToken");

  const getCurrentUserData = async () => {

    try {
      console.log("startapi", );

      const response = await apiGet("/auth/myProfile");
      const userData = response.data?.data?.user;
      console.log("userDatafrom app.jsx", userData);
      if (userData) {
        dispatch({
          type: "currentUserData",
          payload: userData,
        });
      }
    } catch (error) {

      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    console.log(getToken(),"token")
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
