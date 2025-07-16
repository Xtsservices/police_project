import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { apiGet } from "../api";
import "../styles/Dashboard.css";

const { Title } = Typography;

// Default data structure to ensure no undefined errors
const defaultDashboardData = {
  hospitals: {
    total: 0,
    statusCounts: {
      active: 0,
      inactive: 0,
      suspended: 0,
      rejected: 0,
    },
    recentRegistrations: 0,
  },
  users: {
    total: 0,
    byRoleAndStatus: {
      hospital_admin: {
        active: 0,
        inactive: 0,
        rejected: 0,
      },
      super_admin: {
        active: 0,
        inactive: 0,
        rejected: 0,
      },
    },
    recentRegistrations: 0,
  },
  patients: {
    total: 0,
    recentRegistrations: 0,
  },
  appointments: {
    total: 0,
    statusCounts: {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      pending: 0,
    },
    recentAppointments: 0,
    completed: 0,
    scheduled: 0,
  },
};

const Dashboard = () => {
  const user = useSelector((state) => state.currentUserData);
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);

  const cardStyles = {
    bigCard: {
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      border: "none",
      overflow: "hidden",
    },
    mediumCard: {
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      border: "1px solid #f0f0f0",
      height: "140px",
    },
    smallCard: {
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      border: "1px solid #f5f5f5",
      minHeight: "80px",
    },
  };

  const gradients = {
    hospital: "linear-gradient(135deg, #1890ff, #40c4ff)",
    user: "linear-gradient(135deg, #722ed1, #b37feb)",
    patient: "linear-gradient(135deg, #52c41a, #95de64)",
    appointment: "linear-gradient(135deg, #fa8c16, #ffc107)",
  };

  const statusColors = {
    active: "#52c41a",
    inactive: "#f5222d",
    suspended: "#faad14",
    rejected: "#8c8c8c",
    scheduled: "#1890ff",
    completed: "#52c41a",
    cancelled: "#f5222d",
    pending: "#faad14",
  };

  const BigCardTitle = ({ title, gradient, icon }) => (
    <div
      style={{
        background: gradient,
        padding: "20px 24px",
        margin: "-1px -1px 0 -1px",
        borderRadius: "16px 16px 0 0",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {icon}
        {title}
      </div>
    </div>
  );

  const StatusCard = ({ title, value, color }) => (
    <Card style={cardStyles.smallCard} bodyStyle={{ padding: "16px" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{ fontSize: "12px", color: "#8c8c8c", marginBottom: "4px" }}
        >
          {title}
        </div>
        <div style={{ fontSize: "24px", fontWeight: "600", color }}>
          {value}
        </div>
      </div>
    </Card>
  );

  async function getStats() {
    try {
      const response = await apiGet("/dashboard/stats");
      console.log("responsestats", response);
      // Merge API response with default data to ensure all fields exist
      const data = response?.data?.data;
      if (data) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default data if API fails
      setDashboardData(defaultDashboardData);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getStats();
    }
  }, [user]);

  console.log("dashboardData",dashboardData)
  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title
        level={2}
        style={{
          marginBottom: "32px",
          color: "#1f2a44",
          fontWeight: "700",
        }}
      >
        Dashboard Statistics
      </Title>

      <Row gutter={[24, 24]}>
        {/* Hospitals Section */}
        <Col xs={24} lg={12}>
          <Card style={cardStyles.bigCard}>
            <BigCardTitle
              title="Hospitals"
              gradient={gradients.hospital}
              icon={<MedicineBoxOutlined style={{ fontSize: "24px" }} />}
            />
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Total Hospitals"
                      value={dashboardData.hospitals.total}
                      prefix={
                        <MedicineBoxOutlined style={{ color: "#1890ff" }} />
                      }
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Recent Registrations"
                      value={dashboardData.hospitals.recentRegistrations}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div style={{ marginTop: "16px" }}>
                <Title
                  level={5}
                  style={{ color: "#1f2a44", marginBottom: "16px" }}
                >
                  Status Distribution
                </Title>
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Active"
                      value={dashboardData.hospitals.statusCounts.active}
                      color={statusColors.active}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Inactive"
                      value={dashboardData.hospitals.statusCounts.inactive}
                      color={statusColors.inactive}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Suspended"
                      value={dashboardData.hospitals.statusCounts.suspended}
                      color={statusColors.suspended}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Rejected"
                      value={dashboardData.hospitals.statusCounts.rejected}
                      color={statusColors.rejected}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>

        {/* Users Section */}
        <Col xs={24} lg={12}>
          <Card style={cardStyles.bigCard}>
            <BigCardTitle
              title="Users"
              gradient={gradients.user}
              icon={<UserOutlined style={{ fontSize: "24px" }} />}
            />
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Total Users"
                      value={dashboardData.users.total}
                      prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Recent Registrations"
                      value={dashboardData.users.recentRegistrations}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div style={{ marginTop: "16px" }}>
                <Title
                  level={5}
                  style={{ color: "#1f2a44", marginBottom: "16px" }}
                >
                  Hospital Admins
                </Title>
                <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Active"
                      value={
                        dashboardData.users.byRoleAndStatus.hospital_admin
                          .active
                      }
                      color={statusColors.active}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Inactive"
                      value={
                        dashboardData.users.byRoleAndStatus.hospital_admin
                          .inactive
                      }
                      color={statusColors.inactive}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Rejected"
                      value={
                        dashboardData.users.byRoleAndStatus.hospital_admin
                          .rejected
                      }
                      color={statusColors.rejected}
                    />
                  </Col>
                </Row>
                <Title
                  level={5}
                  style={{ color: "#1f2a44", marginBottom: "16px" }}
                >
                  Super Admins
                </Title>
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Active"
                      value={
                        dashboardData.users.byRoleAndStatus.super_admin.active
                      }
                      color={statusColors.active}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Inactive"
                      value={
                        dashboardData.users.byRoleAndStatus.super_admin.inactive
                      }
                      color={statusColors.inactive}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <StatusCard
                      title="Rejected"
                      value={
                        dashboardData.users.byRoleAndStatus.super_admin.rejected
                      }
                      color={statusColors.rejected}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>

        {/* Patients Section */}
        <Col xs={24} lg={12}>
          <Card style={cardStyles.bigCard}>
            <BigCardTitle
              title="Patients"
              gradient={gradients.patient}
              icon={<TeamOutlined style={{ fontSize: "24px" }} />}
            />
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Total Patients"
                      value={dashboardData.patients.total}
                      prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Recent Registrations"
                      value={dashboardData.patients.recentRegistrations}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* Appointments Section */}
        <Col xs={24} lg={12}>
          <Card style={cardStyles.bigCard}>
            <BigCardTitle
              title="Appointments"
              gradient={gradients.appointment}
              icon={<CalendarOutlined style={{ fontSize: "24px" }} />}
            />
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Total Appointments"
                      value={dashboardData.appointments.total}
                      prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={cardStyles.mediumCard}>
                    <Statistic
                      title="Recent Appointments"
                      value={dashboardData.appointments.recentAppointments}
                      valueStyle={{ color: "#1f2a44", fontSize: "32px" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div style={{ marginTop: "16px" }}>
                <Title
                  level={5}
                  style={{ color: "#1f2a44", marginBottom: "16px" }}
                >
                  Status Distribution
                </Title>
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Scheduled"
                      value={dashboardData.appointments.statusCounts.scheduled}
                      color={statusColors.scheduled}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Completed"
                      value={dashboardData.appointments.statusCounts.completed}
                      color={statusColors.completed}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Cancelled"
                      value={dashboardData.appointments.statusCounts.cancelled}
                      color={statusColors.cancelled}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <StatusCard
                      title="Pending"
                      value={dashboardData.appointments.statusCounts.pending}
                      color={statusColors.pending}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
