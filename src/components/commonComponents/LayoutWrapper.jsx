import { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faTachometerAlt,
  faUserInjured,
  faUsers,
  faHospital,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/cross_logo.png";
import customStyles from "./../styles/LayoutWrapper";
import { useSelector } from "react-redux";

const { Header, Sider, Content, Footer } = Layout;

const LayoutWrapper = () => {
  const user = useSelector((state) => state.currentUserData);

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // // Static placeholder user data
  // const user = {
  //   firstname: "John",
  //   lastname: "Doe",
  //   role: "Doctor",
  //   profilepic: null,
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getProfileImage = (user) => {
    if (user?.profilepic?.data && user?.profilepic?.mimeType) {
      return `data:${user.profilepic.mimeType};base64,${user.profilepic.data}`;
    }
    return null;
  };

  const handleLogout = async () => {
    try {
      const response = await apiPost("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      localStorage.removeItem("appointments");
      console.log("Logout successful:", response.data.message);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      localStorage.removeItem("appointments");
      console.error(
        "Logout API failed:",
        error.response?.statusText || error.message
      );
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      localStorage.removeItem("appointments");
      navigate("/");
    }
  };

  const profileImageSrc = getProfileImage(user);

  const profileMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Menu.Item
        key="logout"
        onClick={() => {
          handleLogout();
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 8 }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <style>{customStyles}</style>
      <Layout className="layout">
        <Header
          className="custom-header"
          style={{ position: "fixed", width: "100%", zIndex: 1001 }}
        >
          <div className="header-left">
            <div className="logo-section">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: 60,
                  width: 100,
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <div className="header-right">
            {/* User Profile Section with Dropdown */}
            <Dropdown overlay={profileMenu} trigger={["click"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#f8fafc",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                <Avatar
                  size={32}
                  src={profileImageSrc}
                  icon={!profileImageSrc && <FontAwesomeIcon icon={faUser} />}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#64748b",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1e293b",
                      lineHeight: "1.2",
                    }}
                  >
                    {user?.firstname || ""} {user?.lastname || ""}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      lineHeight: "1.2",
                    }}
                  >
                    {user?.role || "Doctor"}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout>
          <Sider
            className="sider"
            collapsed={collapsed || (isMobile && !collapsed)}
            collapsible
            trigger={null}
            width={200}
            collapsedWidth={80}
            breakpoint="lg"
            onBreakpoint={(broken) => setIsMobile(broken)}
            style={{
              overflow: "auto",
              height: "calc(100vh - 64px)",
              position: "fixed",
              left: 0,
              top: 64,
              bottom: 0,
              zIndex: 1000,
              marginTop: 5,
              display: isMobile && collapsed ? "none" : "block",
            }}
          >
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Toggle Arrow Button */}
              <div
                style={{
                  padding: "10px",
                  textAlign: "center",
                  background: "#001529",
                  cursor: "pointer",
                }}
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon
                  icon={collapsed ? faArrowRight : faArrowLeft}
                  style={{ color: "#fff", fontSize: "16px" }}
                />
              </div>

              {/* Profile Section */}
              {!collapsed && (
                <div className="sidebar-profile">
                  <div className="profile-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Profile"
                    />
                  </div>
                  <h3 className="profile-name">
                    {user?.firstname || ""} {user?.lastname || ""}
                  </h3>
                </div>
              )}

              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
              >
                {/* For SUPER ADMIN */}
                {user?.role === "super_admin" && (
                  <>
                    <Menu.Item
                      key="dashboard"
                      icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                    >
                      <Link to="/SuperAdmin/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="hospitals"
                      icon={<FontAwesomeIcon icon={faHospital} />}
                    >
                      <Link to="/SuperAdmin/hospitals">Hospitals</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="patients"
                      icon={<FontAwesomeIcon icon={faUsers} />}
                    >
                      <Link to="/SuperAdmin/patients">Patients</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="profile"
                      icon={<FontAwesomeIcon icon={faUser} />}
                    >
                      <Link to="/userProfile">Profile</Link>
                    </Menu.Item>
                  </>
                )}

                {/* For HOSPITAL ADMIN */}
                {user?.role === "hospital_admin" && (
                  <>
                    {/* <Menu.Item
                      key="dashboard"
                      icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                    >
                      <Link to="/hospitaladmin/dashboard">Dashboard</Link>
                    </Menu.Item> */}
                    <Menu.Item
                      key="patients"
                      icon={<FontAwesomeIcon icon={faUsers} />}
                    >
                      <Link to="/hospitaladmin/patients">Patients</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="profile"
                      icon={<FontAwesomeIcon icon={faUser} />}
                    >
                      <Link to="/userProfile">Profile</Link>
                    </Menu.Item>
                  </>
                )}

                {/* Logout is common */}
                <Menu.Item
                  key="logout"
                  icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu>
            </motion.div>
          </Sider>
          <Layout
            style={{
              marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
              transition: "margin-left 0.2s",
              minHeight: "calc(100vh - 64px - 48px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Content className="content" style={{ flex: 1, marginTop: 64 }}>
              <Outlet />
            </Content>
            <Footer className="footer">
              © {new Date().getFullYear()} Created with MetaDev
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutWrapper;
