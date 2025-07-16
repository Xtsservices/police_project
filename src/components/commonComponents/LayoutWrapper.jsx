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
      // const response = await apiPost("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      console.log("Logout successful:", response.data.message);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
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
                      src="data:image/png;base64,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"
                      alt="Profile"
                    />
                  </div>
                  <h3 className="profile-name">
                    {user?.name || ""} 
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
                    {/* <Menu.Item
                      key="patients"
                      icon={<FontAwesomeIcon icon={faUsers} />}
                    >
                      <Link to="/SuperAdmin/patients">Patients</Link>
                    </Menu.Item> */}
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
