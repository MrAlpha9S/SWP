import React from 'react';
import { UserOutlined, ExceptionOutlined, TeamOutlined, FileTextOutlined, MessageOutlined, BookOutlined, TagsOutlined, DollarOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
  { key: 'user', label: 'Quản lý User', icon: <UserOutlined /> },
  { key: 'coach', label: 'Quản lý Coach', icon: <TeamOutlined /> },
  { key: 'reports', label: 'Quản lý Báo cáo', icon: <ExceptionOutlined /> },
  { key: 'post', label: 'Quản lý Bài viết', icon: <FileTextOutlined /> },
  { key: 'comment', label: 'Quản lý Bình luận', icon: <MessageOutlined /> },
  { key: 'blog', label: 'Quản lý Blog', icon: <BookOutlined /> },
  { key: 'topic', label: 'Quản lý Chủ đề', icon: <TagsOutlined /> },
  { key: 'subscription', label: 'Quản lý Đăng ký', icon: <DollarOutlined /> },
  { key: 'checkin', label: 'Quản lý Check-in', icon: <EditOutlined /> },
  { key: 'user-achievement', label: 'Quản lý Huy hiệu', icon: <TagsOutlined /> },
  { key: 'statistics', label: 'Thống kê', icon: <BarChartOutlined /> },
];

const AdminSidebar = ({ currentTab, setCurrentTab, collapse = false, mode }) => (
  <Menu
    onClick={e => setCurrentTab(e.key)}
    defaultSelectedKeys={['statistics']}
    mode={mode}
    items={items}
    inlineCollapsed={collapse}
    selectedKeys={[currentTab]}
  />
);

export default AdminSidebar;
