import React, { useEffect, useState } from 'react';
import { Table, Button, message, Avatar, Popconfirm } from 'antd';
import { CheckOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getPendingCoaches, approveCoach, rejectCoach } from '../../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const IsPendingCoach = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getPendingCoaches(token);
      setCoaches(data.data || data.coaches || []);
    } catch (err) {
      message.error('Lỗi tải danh sách coach chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCoaches();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleApproveCoach = async (user_id) => {
    try {
      const token = await getAccessTokenSilently();
      await approveCoach(user_id, token);
      message.success('Duyệt coach thành công');
      fetchCoaches();
    } catch (err) {
      message.error('Lỗi duyệt coach');
    }
  };

  const handleRejectCoach = async (user_id) => {
    try {
      const token = await getAccessTokenSilently();
      await rejectCoach(user_id, token);
      message.success('Từ chối coach thành công');
      fetchCoaches();
    } catch (err) {
      message.error('Lỗi từ chối coach');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Avatar', key: 'avatar', render: (_, record) => <Avatar src={record.avatar} /> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, coach) => (
        <div className="flex gap-2">
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleApproveCoach(coach.user_id)}
            className="border-green-500 text-green-600"
          />
          <Popconfirm
            title="Xóa coach này?"
            onConfirm={() => handleRejectCoach(coach.user_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Duyệt Coach</h2>
        <Button type="primary" icon={<ReloadOutlined />} onClick={fetchCoaches} loading={loading}>
          Làm mới
        </Button>
      </div>
      <Table
        dataSource={coaches}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default IsPendingCoach;