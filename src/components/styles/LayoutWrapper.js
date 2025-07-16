  const  customStyles = `
    .ant-layout {
      min-height: 100vh;
    }
    
    .ant-layout-header {
      position: fixed;
      z-index: 1001;
      width: 100%;
      padding: 0;
    }
    
    .ant-layout-sider {
      position: fixed;
      height: 100vh;
      z-index: 1000;
      top: 0;
      left: 0;
      margin-top: 64px;
    }
    
    .ant-layout-content {
      margin-top: 64px !important;
      padding: 24px;
    }

    .custom-header {
      background: #ffffff !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      border-bottom: 1px solid #f0f0f0 !important;
      padding: 0 24px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      height: 64px !important;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .app-title {
      color: #1890ff !important;
      font-size: 20px !important;
      font-weight: 600 !important;
      margin: 0 !important;
      letter-spacing: -0.5px !important;
    }
    
    .connect-subtitle {
      color: #666 !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      margin: 0 !important;
      margin-top: -2px !important;
    }
    
    .toggle-btn {
      color: #666 !important;
      cursor: pointer !important;
      font-size: 18px !important;
      padding: 8px !important;
      border-radius: 4px !important;
      transition: all 0.2s !important;
    }
    
    .toggle-btn:hover {
      background: #f5f5f5 !important;
      color: #1890ff !important;
    }
    
    .notification-btn {
      color: #666 !important;
      cursor: pointer !important;
      font-size: 18px !important;
      padding: 8px !important;
      border-radius: 50% !important;
      transition: all 0.2s !important;
      position: relative !important;
    }
    
    .notification-btn:hover {
      background: #f5f5f5 !important;
      color: #1890ff !important;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    
    .user-info:hover {
      background: #f5f5f5;
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .user-name {
      color: #333 !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      margin: 0 !important;
      line-height: 1.2 !important;
    }
    
    .user-role {
      color: #666 !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      margin: 0 !important;
      line-height: 1.2 !important;
    }

    .ant-layout-sider {
      background: linear-gradient(180deg, #4a6fa5 0%, #3d5a8a 100%) !important;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    }
    
    .ant-menu-dark {
      background: transparent !important;
      border-right: none !important;
    }
    
    .ant-menu-dark .ant-menu-item {
      background: transparent !important;
      border-radius: 8px !important;
      // margin: 4px 12px !important;
      padding: 12px 16px !important;
      height: auto !important;
      line-height: 1.4 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      transition: all 0.3s ease !important;
    }
    
    .ant-menu-dark .ant-menu-item:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateX(2px) !important;
    }
    
    .ant-menu-dark .ant-menu-item-selected {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: #ffffff !important;
    }
    
    .ant-menu-dark .ant-menu-item a {
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      display: flex !important;
      align-items: center !important;
    }
    
    .ant-menu-dark .ant-menu-item .anticon {
      color: #ffffff !important;
      font-size: 16px !important;
      margin-right: 12px !important;
      min-width: 16px !important;
    }
    
    .sidebar-profile {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }
    
    .profile-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 0 auto 12px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
    }
    
    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-name {
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
  `;

  
export default customStyles;