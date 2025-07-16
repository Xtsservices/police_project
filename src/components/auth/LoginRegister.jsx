"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import { apiPostWithoutToken } from "../api";
import "../styles/LoginRegister.css";
import loginImg from "../../assets/login.jpg";
import { useDispatch } from "react-redux";

const LoginRegister = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [currentUserType, setCurrentUserType] = useState("");
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    gstNumber: "",
    panNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
    contactInfo: {
      countryCode: "+91",
      phone: "",
      email: "",
      pointOfContact: "",
    },
  });

  useEffect(() => {
    message.config({
      top: 20,
      duration: 3,
      maxCount: 1,
    });

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((timer) => timer - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validatePhone = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const getRouteFromUserType = (role) => {
    console.log("role",role)
    if (role === "super_admin") return "/SuperAdmin/dashboard";
    if (role === "hospital_admin") return "/hospitaladmin/patients";
  };


  // send otp to user
  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      message.error("Please enter a valid 10-digit mobile number");
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      console.log("generateotpdata", phone);

      const data = await apiPostWithoutToken("/auth/generate-otp", { phone });

      console.log("generateotpdata", data);

      if (data.data.userId || data.data.success !== false) {
        setOtpSent(true);
        setOtpTimer(60);
        message.success(data.data.message || "OTP sent successfully!");
        toast.success(data.data.message || "OTP sent successfully!");
      } else {
        message.error(data.data.message || "Failed to send OTP.");
        toast.error(data.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.log("error=========", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter the complete 6-digit OTP");
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiPostWithoutToken("/auth/verify-otp", {
        otp: otp,
        phone: phone,
      });

      console.log("verify", data);
      if (data.status === 200) {
        toast.success(`Login successful`);

        const hospitalData = data?.data?.data?.hospital;
        const accessToken = data?.data?.data?.session?.token;
        const userData = data?.data?.data?.user;
         if (userData) {
        dispatch({
          type: "currentUserData",
          payload: userData,
        });
      }

        localStorage.setItem("accessToken", accessToken);
        console.log("hospitalData",hospitalData)
        console.log("accessToken",accessToken)
        console.log("user",userData)
        const redirectRoute = getRouteFromUserType(userData.role);
        setTimeout(() => navigate(redirectRoute), 1000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.status === 401
          ? "Invalid OTP."
          : error.message?.includes("Network Error")
          ? "Network Error: Unable to connect to server."
          : "Verification failed.";
      message.error(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const [validationErrors, setValidationErrors] = useState({});

  const handleRegister = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setIsLoading(true);
    console.log("formData", formData);
    try {
      const data = await apiPostWithoutToken("/hospitals/register", formData);
      console.log("registerdata", data);

      if (data.data.success) {
        message.success(
          data.data.message || "Registration successful! Please login."
        );
        toast.success(
          data.data.message || "Registration successful! Please login."
        );
        setIsRegisterForm(false);
        setFormData({
          name: "",
          licenseNumber: "",
          gstNumber: "",
          panNumber: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          contactInfo: {
            countryCode: "+91",
            phone: "",
            email: "",
            pointOfContact: "",
          },
        });
      } else {
        message.error(data.data.message || "Failed to register.");
        toast.error(data.data.message || "Failed to register.");
      }
    } catch (error) {
      console.log("error", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      const errorMsg =
        error.response?.status === 400
          ? "Invalid request."
          : error.response?.status === 500
          ? "Server error."
          : error.message?.includes("Network Error")
          ? "Network Error: Unable to connect to server."
          : "Registration failed.";
      message.error(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhoneLogin = () => {
    setOtpSent(false);
    setOtpTimer(0);
    setPhone("");
    setOtp("");
    setUserId("");
    setCurrentUserType("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const validateFields = () => {
    const errors = {};

    if (!formData.name?.trim()) errors.name = "Hospital Name is required";
    if (!formData.licenseNumber?.trim())
      errors.licenseNumber = "License Number is required";
    if (!formData.gstNumber?.trim())
      errors.gstNumber = "GST Number is required";
    if (!formData.panNumber?.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/))
      errors.panNumber = "Invalid PAN format";

    const address = formData.address || {};
    if (!address.street?.trim()) errors.street = "Street is required";
    if (!address.city?.trim()) errors.city = "City is required";
    if (!address.state?.trim()) errors.state = "State is required";
    if (!address.zipCode?.match(/^\d{6}$/))
      errors.zipCode = "Zip code must be 6 digits";

    const contact = formData.contactInfo || {};
    if (!contact.countryCode?.trim())
      errors.countryCode = "Country code is required";
    if (!contact.phone?.match(/^\d{10}$/))
      errors.phone = "Phone must be 10 digits";
    if (!contact.email?.match(/^\S+@\S+\.\S+$/)) errors.email = "Invalid email";
    if (!contact.pointOfContact?.trim())
      errors.pointOfContact = "Point of Contact is required";

    return errors;
  };

  const handleInputChange = (e, nestedField = null) => {
    let { name, value } = e.target;

    // Force PAN to uppercase
    if (name === "panNumber") {
      value = value.toUpperCase();
    }

    // Restrict phone number to digits only and max 10
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10); // digits only, max 10
    }

    // Zip Code: Digits only, max 6
    if (name === "zipCode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }

    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getUserTypeDisplay = () => {
    if (!currentUserType) return "";
    return ` (${
      currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)
    })`;
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d9d9d9",
  };

  return (
    <div
      className="login-container"
      style={{
        fontSize: "0.8rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "20px 10px" : "0px 50px",
      }}
    >
      <img
        src={loginImg}
        alt="Login Visual"
        className="login-image"
        style={{
          maxWidth: isMobile ? "90vw" : "550px",
          maxHeight: isMobile ? "400px" : "640px",
          borderRadius: "40px",
          width: isMobile ? "100%" : "100%",
          marginTop: isMobile ? "20px" : "0px",
          marginLeft: isMobile ? "0" : "50px",
          marginRight: isMobile ? "0" : "20px",
          display: "block",
          objectFit: "cover",
        }}
      />
      <div
        className="login-form-container"
        style={{
          width: isMobile ? "100%" : "350px",
          margin: isMobile ? "20px 0 0 0" : "50",
          padding: isMobile ? "10px" : "52px",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: isMobile ? "none" : "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {isRegisterForm ? (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Register
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              {/* Left Column */}
              <div style={{ flex: "1 1 45%" }}>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Hospital Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  {validationErrors.name && (
                    <span style={{ color: "red" }}>
                      {validationErrors.name}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  {validationErrors.licenseNumber && (
                    <span style={{ color: "red" }}>
                      {validationErrors.licenseNumber}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="GST Number"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  {validationErrors.gstNumber && (
                    <span style={{ color: "red" }}>
                      {validationErrors.gstNumber}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="PAN Number"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  {validationErrors.panNumber && (
                    <span style={{ color: "red" }}>
                      {validationErrors.panNumber}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange(e, "address")}
                    style={inputStyle}
                  />
                  {validationErrors.street && (
                    <span style={{ color: "red" }}>
                      {validationErrors.street}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange(e, "address")}
                    style={inputStyle}
                  />
                  {validationErrors.city && (
                    <span style={{ color: "red" }}>
                      {validationErrors.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div style={{ flex: "1 1 45%" }}>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange(e, "address")}
                    style={inputStyle}
                  />
                  {validationErrors.state && (
                    <span style={{ color: "red" }}>
                      {validationErrors.state}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange(e, "address")}
                    style={inputStyle}
                  />
                  {validationErrors.zipCode && (
                    <span style={{ color: "red" }}>
                      {validationErrors.zipCode}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.address.country}
                    readOnly
                    style={{
                      ...inputStyle,
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      name="countryCode"
                      placeholder="+91"
                      value={formData.contactInfo.countryCode}
                      onChange={(e) => handleInputChange(e, "contactInfo")}
                      style={{ ...inputStyle, flex: "1" }}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange(e, "contactInfo")}
                      style={{ ...inputStyle, flex: "2" }}
                    />
                  </div>
                  {(validationErrors.countryCode || validationErrors.phone) && (
                    <span style={{ color: "red" }}>
                      {validationErrors.countryCode || validationErrors.phone}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange(e, "contactInfo")}
                    style={inputStyle}
                  />
                  {validationErrors.email && (
                    <span style={{ color: "red" }}>
                      {validationErrors.email}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    name="pointOfContact"
                    placeholder="Point of Contact"
                    value={formData.contactInfo.pointOfContact}
                    onChange={(e) => handleInputChange(e, "contactInfo")}
                    style={inputStyle}
                  />
                  {validationErrors.pointOfContact && (
                    <span style={{ color: "red" }}>
                      {validationErrors.pointOfContact}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: isLoading ? "#d9d9d9" : "#1890ff",
                color: "#fff",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            <p style={{ marginTop: "5px" }}>
              Already have an account?{" "}
              <a
                onClick={() => {
                  setIsRegisterForm(false);
                }}
                className="link"
                style={{ cursor: "pointer" }}
              >
                Login
              </a>
            </p>
          </div>
        ) : (
          <LoginForm
            otpSent={otpSent}
            phone={phone}
            otp={otp}
            isLoading={isLoading}
            otpTimer={otpTimer}
            userTypeDisplay={getUserTypeDisplay()}
            onPhoneChange={handlePhoneChange}
            onOtpChange={handleOtpChange}
            onSendOTP={handleSendOTP}
            onVerifyOTP={handleOTPVerification}
            onReset={resetPhoneLogin}
            onToggleForm={() => setIsRegisterForm(true)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
