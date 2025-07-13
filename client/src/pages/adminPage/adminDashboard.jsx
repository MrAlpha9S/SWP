import React, { useState } from 'react';
import AdminSidebar from '../../components/layout/admin/adminSidebar.jsx';
import PageFadeWrapper from '../../components/utils/PageFadeWrapper.jsx';
import UserManagement from '../../components/layout/admin/UserManagement.jsx';
import CoachManagement from '../../components/layout/admin/CoachManagement.jsx';
import PostManagement from '../../components/layout/admin/PostManagement.jsx';
import CommentManagement from '../../components/layout/admin/CommentManagement.jsx';
import BlogManagement from '../../components/layout/admin/BlogManagement.jsx';
import TopicManagement from '../../components/layout/admin/TopicManagement.jsx';
import SubscriptionManagement from '../../components/layout/admin/SubscriptionManagement.jsx';
import CheckinManagement from '../../components/layout/admin/CheckinManagement.jsx';
import Statistics from '../../components/layout/admin/Statistics.jsx';

const boardMap = {
  user: <UserManagement />,
  coach: <CoachManagement />,
  post: <PostManagement />,
  comment: <CommentManagement />,
  blog: <BlogManagement />,
  topic: <TopicManagement />,
  subscription: <SubscriptionManagement />,
  checkin: <CheckinManagement />,
  statistics: <Statistics />,
};

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('statistics');

  return (
    <PageFadeWrapper>
      <div className="w-full min-h-screen bg-primary-50 flex flex-col items-center">
        <div className="w-[1680px] flex flex-col md:flex-row gap-4 px-1 py-4 md:px-4">
          {/* Sidebar */}
          <div className="sticky top-[155px] self-start h-fit hidden md:block">
            <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} mode="inline" />
          </div>
          <div className="max-w-[30%] sticky top-[155px] self-start h-fit md:hidden">
            <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} collapse={true} mode="horizontal" />
          </div>
          {/* Board */}
          <div className="w-full flex flex-col items-center gap-4 px-1 pb-4 md:px-4">
            {boardMap[currentTab]}
          </div>
        </div>
      </div>
    </PageFadeWrapper>
  );
};

export default AdminDashboard; 