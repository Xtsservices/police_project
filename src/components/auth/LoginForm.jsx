// LoginForm.jsx
import React from "react";
import logo from "../../assets/cross_logo.png";

const LoginForm = ({
  otpSent,
  phone,
  otp,
  isLoading,
  otpTimer,
  userTypeDisplay,
  onPhoneChange,
  onOtpChange,
  onSendOTP,
  onVerifyOTP,
  onReset,
  onToggleForm,
  selectedUserType,
  onSelectUserType,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.name === "phone") {
      onSendOTP();
    } else if (e.target.value.length === 6 && e.target.name === "verifyotp") {
      onVerifyOTP();
    }
  };

  const userTypes = [
    { label: "Admin", value: "admin" },
    { label: "Hospital User", value: "hospital" },
    { label: "Patient", value: "patient" },
  ];

  return (
    <div className="login-form">
      <div className="form-header" style={{ textAlign: "center" }}>
        <h1 className="form-title">{otpSent ? "Enter OTP" : ""}</h1>
        <img
          src={logo}
          style={{ height: "120px", width: "120px", marginBottom: "10px" }}
        />
        {!otpSent && (
          <>
            <h3 style={{ marginBottom: "8px" }}>I am</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {userTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onSelectUserType(type.value)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border:
                      selectedUserType === type.value
                        ? "2px solid #1890ff"
                        : "1px solid #ccc",
                    background:
                      selectedUserType === type.value ? "#e6f7ff" : "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <p className="form-subtitle">
              Enter your registered mobile number to continue
            </p>
          </>
        )}
      </div>

      {!otpSent ? (
        <div className="form-content">
          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={onPhoneChange}
              className="input-field"
              onKeyDown={handleKeyDown}
              name="phone"
            />
          </div>
          <div className="form-actions">
            <button className="text-button">Login with OTP</button>
          </div>
          <button
            onClick={onSendOTP}
            disabled={!phone || phone.length !== 10 || isLoading || !selectedUserType}
            className="action-button"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="form-content">
          <div className="otp-info">
            <p>
              OTP sent to +91 {phone} {userTypeDisplay}
            </p>
            <button onClick={onReset} className="text-button">
              ← Change number
            </button>
          </div>
          <div className="input-group">
            <label className="input-label">Enter OTP</label>
            <input
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={onOtpChange}
              className="input-field otp-input"
              name="verifyotp"
            />
          </div>
          <div className="form-actions">
            <span>
              {otpTimer > 0
                ? `Resend OTP in ${otpTimer}s`
                : "Didn't receive OTP?"}
            </span>
            {otpTimer === 0 && (
              <button
                onClick={onSendOTP}
                disabled={isLoading}
                className="text-button"
              >
                {isLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
          <button
            name="verifyotp"
            onClick={onVerifyOTP}
            disabled={!otp || otp.length !== 6 || isLoading}
            className="action-button"
          >
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </div>
      )}
      <div className="form-footer">
        <p>
          By continuing, you agree to our {" "}
          <a href="#" className="link">
            Terms of Service
          </a>{" "}
          and {" "}
          <a href="#" className="link">
            Privacy Policy
          </a>
        </p>
        <p>
          Don't have an account? {" "}
          <a onClick={onToggleForm} className="link" style={{ cursor: "pointer" }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
