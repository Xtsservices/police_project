import React, { useEffect, useState } from "react";
import "../styles/PatientDashboard.css";
import loginImg from "../../assets/cross_logo.png";
import { useSelector } from "react-redux";
import { apiGet } from "../api";
import {
  LogoutOutlined,
  UserOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  Menu,
  Avatar,
  message,
  Spin,
  Modal,
  Tabs,
  Button,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PatientDashboard = () => {
  const user = useSelector((state) => state.currentUserData);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReports, setSelectedReports] = useState({});
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const fetchReports = async (appointmentId) => {
    try {
      const res = await apiGet(
        `/appointment-documents/appointment?appointmentId=${appointmentId}`
      );
      console.log("resboom", res);
      return res.data?.data?.documents || {};
    } catch (err) {
      console.error("Error fetching report for appointment:", err);
      return {};
    }
  };

  const getMyAppointmentsData = async () => {
    setLoading(true);
    try {
      const response = await apiGet("/patient-auth/myAppointments");
      const rawAppointments = response?.data?.data?.appointments || [];
      console.log("rawAppointments", rawAppointments);
      const enrichedAppointments = await Promise.all(
        rawAppointments.map(async (appt) => {
          const reports = await fetchReports(appt.id);
          return {
            ...appt,
            reports,
          };
        })
      );

      setAppointments(enrichedAppointments);
    } catch (error) {
      console.log("error", error);
      message.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getMyAppointmentsData();
  }, [user,navigate]);

  console.log("user",user)

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    message.success("Logged out successfully");
    navigate("/");
  };

  const openReportModal = (reports, id) => {
    setSelectedReports(reports || {});
    setSelectedAppointmentId(id);
    setModalVisible(true);
  };

  console.log("appointments", appointments);
  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <img src={loginImg} alt="Left Logo" className="logo" />
        <h2 className="dashboard-title">Patient Dashboard</h2>
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <Avatar icon={<UserOutlined />} className="avatar-icon" />
        </Dropdown>
      </header>

      <main className="dashboard-content">
        <h3>Your Reports</h3>
        {loading ? (
          <div className="loading-spinner">
            <Spin tip="Loading appointments..." />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hospital</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Reports</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <tr key={appt.id}>
                      <td>{index + 1}</td>
                      <td>{appt.hospital?.name || "N/A"}</td>
                      <td>
                        {moment(appt.appointmentDate).format("DD-MM-YYYY")}
                      </td>
                      <td>{appt.appointmentTime}</td>
                      <td>{appt.status}</td>
                      <td>
                        <EyeOutlined
                          onClick={() => openReportModal(appt.reports, appt.id)}
                          style={{
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#007bff",
                          }}
                          title="View Reports"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Created with MetaDev</p>
      </footer>

      <Modal
        title="View Reports"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {Object.keys(selectedReports).every(
          (key) => selectedReports[key].length === 0
        ) ? (
          <p>No reports available for this appointment.</p>
        ) : (
          <Tabs
            defaultActiveKey="labReports"
            items={Object.entries(selectedReports)
              .filter(([_, docs]) => docs.length > 0)
              .map(([key, docs]) => ({
                key,
                label: key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
                children: (
                  <div className="report-section">
                    {docs.map((doc) => (
                      <div className="report-card" key={doc.id}>
                        <p>
                          <strong>{doc.documentName}</strong>
                        </p>
                        {doc.mimeType.startsWith("image/") ? (
                          <img
                            src={doc.fileData}
                            alt="Preview"
                            className="report-preview"
                          />
                        ) : doc.mimeType === "application/pdf" ? (
                          <iframe
                            src={doc.fileData}
                            title={doc.documentName}
                            className="report-preview"
                          />
                        ) : (
                          <p>Unsupported file type</p>
                        )}
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = doc.fileData;
                            link.download = doc.documentName;
                            link.click();
                          }}
                          style={{ marginTop: "10px" }}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ),
              }))}
          />
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
