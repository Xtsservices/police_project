import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Dropdown, Menu, Modal, Input, Button, Tag, Pagination, Typography, Tabs } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { apiGet, apiPost } from "../../api";

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SuperadminHospitalsList = () => {
  const user = useSelector((state) => state.currentUserData);
  const [hospitals, setHospitals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("inactive"); // Default to inactive
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
  });
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  async function getHospitals() {
    try {
      const response = await apiGet(`/dashboard/hospitals?status=${status}&page=${currentPage}&limit=10`);
      const { data, pagination: pag } = response?.data || {};
      if (data && Array.isArray(data)) {
        setHospitals(data);
        setPagination(pag || { totalPages: 1, totalRecords: 0, recordsPerPage: 10 });
      } else {
        setHospitals([]);
        setPagination({ totalPages: 1, totalRecords: 0, recordsPerPage: 10 });
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    }
  }

  async function handleApprove(hospitalId) {
    try {
      const response = await apiPost(`/dashboard/approve-hospital`, { hospitalId });
      console.log("responsehandleApprove", response);
      getHospitals();
    } catch (error) {
      console.error("Error approving hospital:", error);
    }
  }

  async function handleReject(hospitalId) {
    try {
      await apiPost(`/dashboard/hospitals/${hospitalId}/reject`, { reason: rejectReason });
      getHospitals();
      setShowRejectModal(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting hospital:", error);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getHospitals();
    }
  }, [user, currentPage, status]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status?.toUpperCase() || "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      render: formatDate,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "User Count",
      dataIndex: "userCount",
      key: "userCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              {status === "inactive" && (
                <Menu.Item key="approve" onClick={() => handleApprove(record.id)}>
                  Approve
                </Menu.Item>
              )}
              <Menu.Item key="reject" onClick={() => setShowRejectModal(record.id)}>
                Reject
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Hospitals
      </Title>
      <Tabs
        activeKey={status}
        onChange={(key) => {
          setStatus(key);
          setCurrentPage(1); // Reset to page 1 when switching tabs
        }}
      >
        <TabPane tab="Active" key="active" />
        <TabPane tab="Inactive" key="inactive" />
      </Tabs>
      <Table
        columns={columns}
        dataSource={hospitals}
        rowKey="id"
        bordered
        pagination={false}
        locale={{ emptyText: `No ${status} hospitals found` }}
      />
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          Showing {hospitals.length} of {pagination.totalRecords} hospitals
        </span>
        <Pagination
          current={currentPage}
          total={pagination.totalRecords}
          pageSize={pagination.recordsPerPage}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          showQuickJumper={false}
        />
      </div>
      <Modal
        title="Reject Hospital"
        open={!!showRejectModal}
        onCancel={() => {
          setShowRejectModal(null);
          setRejectReason("");
        }}
        footer={[
          <Button key="cancel" onClick={() => setShowRejectModal(null)}>
            Cancel
          </Button>,
          <Button
            key="reject"
            type="primary"
            danger
            disabled={!rejectReason.trim()}
            onClick={() => handleReject(showRejectModal)}
          >
            Reject
          </Button>,
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Enter reason for rejection"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default SuperadminHospitalsList;