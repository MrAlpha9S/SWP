import React from 'react';
import { Tabs } from 'antd';
import CoachManagement from './CoachManagement';
import IsPendingCoach from './coachmanage/isPendingCoach';

const items = [
  {
    key: '1',
    label: 'Quản lý Coach',
    children: <CoachManagement />,
  },
  {
    key: '2',
    label: 'Duyệt Coach',
    children: <IsPendingCoach />,
  },
];

const CoachTabs = () => {
  return (
    <div className="w-full h-screen">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default CoachTabs; 