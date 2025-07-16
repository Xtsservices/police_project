import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Typography,
  message,
  Select,
} from "antd";
import { apiGet, apiPost } from "../../api";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Title } = Typography;
const { Option } = Select;

const HospitalAdminPatients = () => {
  const user = useSelector((state) => state.currentUserData);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewReportModal, setViewReportModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [labReports, setLabReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const [uploadType, setUploadType] = useState(null); // lab_report or prescription

  async function getPatients(page = 1) {
    try {
      const response = await apiGet(
        `/dashboard/getAppointmentsWithDetails?page=${page}`
      );
      const { data, pagination: pag } = response?.data || {};
      if (data && Array.isArray(data)) {
        setPatients(
          data.map((item) => ({
            ...item,
            patientName: item.patient?.name,
            gender: item.patient?.gender,
            policeIdNo: item.patient?.policeIdNo,
            status: item.status,
            createdDate: item.createdDate,
          }))
        );
        setPagination(
          pag || { totalPages: 1, totalRecords: 0, recordsPerPage: 10 }
        );
      } else {
        setPatients([]);
        setPagination({ totalPages: 1, totalRecords: 0, recordsPerPage: 10 });
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
      message.error("Failed to fetch patients");
    }
  }

  async function handleAddPatient(values) {
    try {
      await apiPost("/patients/createPatient", values);
      setIsModalOpen(false);
      form.resetFields();
      getPatients(currentPage);
      message.success("Patient added successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.message);

      console.error("Error adding patient:", error);
      message.error("Failed to add patient");
    }
  }

  async function handleUploadReport(appointmentId, type, isInline = false) {
    setUploadType(type);
    fileInputRef.current.click();
    fileInputRef.current.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        message.error("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("document", file);
      formData.append("appointmentId", appointmentId);
      formData.append("documentType", type);
      try {
        await apiPost("/appointment-documents/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success(
          `${type === "prescription" ? "Prescription" : "Lab report"} uploaded`
        );
        getPatients(currentPage);
        if (isInline) handleViewReport(appointmentId);
      } catch (error) {
        console.error("Error uploading report:", error);
        message.error(
          error.response?.data?.message || "Failed to upload report"
        );
      }
      fileInputRef.current.value = "";
    };
  }

  async function handleViewReport(appointmentId) {
    try {
      const response = await apiGet(
        `/appointment-documents/appointment?appointmentId=${appointmentId}`
      );
      const documents = response.data?.data?.documents || {};
      setLabReports(documents.labReports || []);
      setPrescriptions(documents.prescriptions || []);
      setSelectedAppointmentId(appointmentId);
      setViewReportModal(true);
    } catch (error) {
      console.error("Error viewing report:", error);
      message.error("Failed to fetch reports");
    }
  }

  const openInNewTab = (url) => {
    console.log(url), "url";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      message.error("File not found");
    }
  };

  useEffect(() => {
    if (user?.id) {
      getPatients(currentPage);
    }
  }, [user, currentPage]);

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Police ID No",
      dataIndex: "policeIdNo",
      key: "policeIdNo",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewReport(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Patients</Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Patient
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={patients}
        rowKey="id"
        bordered
        pagination={false}
        locale={{ emptyText: "No patients found" }}
      />

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          Showing {patients.length} of {pagination.totalRecords} patients
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
        title="Add Patient"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPatient}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the patient's name" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: "Please enter the mobile number" },
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>
          <Form.Item
            name="aadhar"
            label="Aadhar"
            rules={[
              { required: true, message: "Please enter the Aadhar number" },
              {
                pattern: /^\d{12}$/,
                message: "Aadhar number must be 12 digits",
              },
            ]}
          >
            <Input placeholder="Enter Aadhar number" />
          </Form.Item>
          <Form.Item
            name="policeIdNo"
            label="Police ID No"
            rules={[
              { required: true, message: "Please enter the Police ID number" },
            ]}
          >
            <Input placeholder="Enter Police ID number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Patient Reports"
        open={viewReportModal}
        onCancel={() => {
          setViewReportModal(false);
          setSelectedAppointmentId(null);
          setLabReports([]);
          setPrescriptions([]);
        }}
        footer={null}
        width={800}
      >
        <Title level={4}>Lab Reports</Title>
        <Button
          type="primary"
          onClick={() =>
            handleUploadReport(selectedAppointmentId, "lab_report", true)
          }
          style={{ marginBottom: 12 }}
        >
          Upload Lab Report
        </Button>
        {labReports.length > 0 ? (
          <ul>
            {labReports.map((report, index) => (
              <li key={index}>
                <Button
                  type="link"
                  onClick={() => openInNewTab(report.fileData)}
                >
                  View Lab Report {index + 1}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No lab reports uploaded.</p>
        )}

        <Title level={4} style={{ marginTop: 24 }}>
          Prescriptions
        </Title>
        <Button
          type="primary"
          onClick={() =>
            handleUploadReport(selectedAppointmentId, "prescription", true)
          }
          style={{ marginBottom: 12 }}
        >
          Upload Prescription
        </Button>
        {prescriptions.length > 0 ? (
          <ul>
            {prescriptions.map((prescription, index) => (
              <li key={index}>
                <Button
                  type="link"
                  onClick={() => openInNewTab(prescription.fileData)}
                >
                  View Prescription {index + 1}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No prescriptions available.</p>
        )}
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default HospitalAdminPatients;
