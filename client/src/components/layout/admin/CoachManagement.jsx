import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllCoaches, updateCoach, deleteCoach } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const { Option } = Select;

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch coaches
  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllCoaches(token);
      setCoaches(data.data || data.coaches || []);
    } catch (err) {
      message.error('Lỗi tải danh sách coach');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCoaches();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Open edit modal
  const openEditModal = (coach) => {
    setEditingCoach(coach);
    form.setFieldsValue({ ...coach });
    setIsModalOpen(true);
  };

  // Update coach
  const handleUpdateCoach = async () => {
    try {
      const values = await form.validateFields();
      const token = await getAccessTokenSilently();
      await updateCoach(editingCoach.user_id, values, token);
      message.success('Cập nhật coach thành công');
      setIsModalOpen(false);
      fetchCoaches();
    } catch (err) {
      message.error('Lỗi cập nhật coach');
    }
  };

  // Delete coach
  const handleDeleteCoach = async (user_id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteCoach(user_id, token);
      message.success('Xóa coach thành công');
      fetchCoaches();
    } catch (err) {
      message.error('Lỗi xóa coach');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Bio', dataIndex: 'bio', key: 'bio' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, coach) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(coach)} className="mr-2" />
          <Popconfirm title="Xóa coach này?" onConfirm={() => handleDeleteCoach(coach.user_id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Coach</h2>
      <Table
        dataSource={coaches}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Sửa thông tin Coach"
        open={isModalOpen}
        onOk={handleUpdateCoach}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Nhập username' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Chọn role' }]}> <Select>
            <Option value="Coach">Coach</Option>
            <Option value="Member">Member</Option>
            <Option value="Admin">Admin</Option>
          </Select></Form.Item>
          <Form.Item name="bio" label="Bio"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoachManagement; 