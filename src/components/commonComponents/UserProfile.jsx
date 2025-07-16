import React from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const user = useSelector((state) => state.currentUserData);

  if (!user) {
    return <div className="user-profile">No user data available.</div>;
  }

  return (
    <div className="user-profile">
      <Card title="User Profile" bordered={false} className="user-card">
        <div className="user-field">
          <span className="label">Name:</span>
          <span className="value">{user.name}</span>
        </div>
        <div className="user-field">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="user-field">
          <span className="label">Phone:</span>
          <span className="value">{user.phone}</span>
        </div>
        <div className="user-field">
          <span className="label">Role:</span>
          <span className="value">{user.role}</span>
        </div>
        <div className="user-field">
          <span className="label">Status:</span>
          <span className="value status">{user.status}</span>
        </div>
        <div className="user-field">
          <span className="label">Hospital ID:</span>
          <span className="value">{user.hospitalId}</span>
        </div>
        <div className="user-field">
          <span className="label">User ID:</span>
          <span className="value">{user.id}</span>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
