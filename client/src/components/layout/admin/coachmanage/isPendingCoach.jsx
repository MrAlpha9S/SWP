import React, { useEffect, useState } from 'react';
import { Table, Button, message, Avatar, Popconfirm, Modal, Descriptions, Tag } from 'antd';
import { CheckOutlined, DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getPendingCoaches, approveCoach, rejectCoach, getPendingCoachDetails } from '../../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const IsPendingCoach = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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

  const handleViewCoachDetails = async (user_id) => {
    setModalLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await getPendingCoachDetails(user_id, token);
      setSelectedCoach(response.data);
      setIsModalVisible(true);
    } catch (err) {
      message.error('Lỗi lấy thông tin coach');
    } finally {
      setModalLoading(false);
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
            icon={<EyeOutlined />}
            onClick={() => handleViewCoachDetails(coach.user_id)}
            className="border-blue-500 text-blue-600"
            title="Xem thông tin đơn"
          />
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleApproveCoach(coach.user_id)}
            className="border-green-500 text-green-600"
            title="Duyệt"
          />
          <Popconfirm
            title="Từ chối coach này?"
            description="Thao tác này sẽ xóa thông tin đăng ký và từ chối coach."
            onConfirm={() => handleRejectCoach(coach.user_id)}
            okText="Từ chối"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger title="Từ chối" />
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

      {/* Modal xem chi tiết thông tin coach */}
      <Modal
        title="Thông tin đăng ký Coach"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedCoach(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedCoach(null);
          }}>
            Đóng
          </Button>
        ]}
        width={800}
        confirmLoading={modalLoading}
      >
        {selectedCoach && (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <Descriptions title="Thông tin cá nhân" bordered>
              <Descriptions.Item label="ID" span={3}>{selectedCoach.user_id}</Descriptions.Item>
              <Descriptions.Item label="Tên" span={3}>{selectedCoach.username}</Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>{selectedCoach.email}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo tài khoản" span={3}>
                {new Date(selectedCoach.created_at).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              {selectedCoach.date_of_birth && (
                <Descriptions.Item label="Ngày sinh" span={3}>
                  {new Date(selectedCoach.date_of_birth).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              )}
              {selectedCoach.sex && (
                <Descriptions.Item label="Giới tính" span={3}>
                  <Tag color={selectedCoach.sex === 'Nam' ? 'blue' : selectedCoach.sex === 'Nữ' ? 'pink' : 'default'}>
                    {selectedCoach.sex}
                  </Tag>
                </Descriptions.Item>
              )}
              {selectedCoach.cccd && (
                <Descriptions.Item label="CCCD" span={3}>{selectedCoach.cccd}</Descriptions.Item>
              )}
              {selectedCoach.cccd_issued_date && (
                <Descriptions.Item label="Ngày cấp CCCD" span={3}>
                  {new Date(selectedCoach.cccd_issued_date).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              )}
              {selectedCoach.address && (
                <Descriptions.Item label="Địa chỉ" span={3}>{selectedCoach.address}</Descriptions.Item>
              )}
            </Descriptions>

            {/* Thông tin coach */}
            <Descriptions title="Thông tin Coach" bordered>
              {selectedCoach.years_of_exp && (
                <Descriptions.Item label="Kinh nghiệm" span={3}>
                  {selectedCoach.years_of_exp} năm
                </Descriptions.Item>
              )}
              {selectedCoach.motto && (
                <Descriptions.Item label="Phương châm" span={3}>
                  {selectedCoach.motto}
                </Descriptions.Item>
              )}
              {selectedCoach.bio && (
                <Descriptions.Item label="Giới thiệu ngắn" span={3}>
                  {selectedCoach.bio}
                </Descriptions.Item>
              )}
              {selectedCoach.detailed_bio && (
                <Descriptions.Item label="Giới thiệu chi tiết" span={3}>
                  <div className="whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {selectedCoach.detailed_bio}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Avatar */}
            {selectedCoach.avatar && (
              <div className="text-center">
                <h4 className="mb-2">Ảnh đại diện</h4>
                <Avatar 
                  src={selectedCoach.avatar} 
                  size={100}
                  className="border-2 border-gray-200"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IsPendingCoach;