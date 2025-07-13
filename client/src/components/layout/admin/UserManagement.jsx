import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { getAllUsers, updateUser, deleteUser, toggleBanUser, createUser } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Thêm state cho modal tạo user mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // Hàm mở modal tạo user mới và reset form
  const openCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllUsers(token);
      setUsers(data.data || data.users || []);
    } catch (err) {
      message.error('Lỗi tải danh sách user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'Member',
      avatar: user.avatar || '',
      isBanned: !!user.isBanned,
    });
    setIsModalOpen(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      const token = await getAccessTokenSilently();
      await updateUser(editingUser.user_id, values, token);
      message.success('Cập nhật user thành công');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      message.error('Lỗi cập nhật user');
    }
  };

  // Delete user
  const handleDeleteUser = async (user_id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteUser(user_id, token);
      message.success('Xóa user thành công');
      fetchUsers();
    } catch (err) {
      message.error('Lỗi xóa user');
    }
  };

  // Ban/unban user
  const handleToggleBan = async (user) => {
    try {
      const token = await getAccessTokenSilently();
      await toggleBanUser(user.user_id, token);
      message.success(`${user.isBanned ? 'Mở khóa' : 'Khóa'} user thành công`);
      fetchUsers();
    } catch (err) {
      message.error('Lỗi thao tác');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Banned', dataIndex: 'isBanned', key: 'isBanned', render: (val) => val ? 'Yes' : 'No' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, user) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(user)} className="mr-2" />
          <Popconfirm title="Xóa user này?" onConfirm={() => handleDeleteUser(user.user_id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger className="mr-2" />
          </Popconfirm>
          <Button
            icon={user.isBanned ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => handleToggleBan(user)}
            type={user.isBanned ? 'primary' : 'default'}
          >
            {user.isBanned ? 'Mở khóa' : 'Khóa'}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý User</h2>
      {/* Nút thêm user mới */}
      <Button type="primary" className="mb-4" onClick={openCreateModal}>
        Thêm user mới
      </Button>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      {/* Modal sửa user */}
      <Modal
        title="Sửa thông tin User"
        open={isModalOpen}
        onOk={handleUpdateUser}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Nhập username' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Chọn role' }]}> <Select>
            <Option value="Member">Member</Option>
            <Option value="Coach">Coach</Option>
            <Option value="Admin">Admin</Option>
          </Select></Form.Item>
          <Form.Item name="isBanned" label="Banned" valuePropName="checked">
            <Switch checkedChildren="Banned" unCheckedChildren="Active" />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal tạo user mới */}
      <Modal
        title="Thêm user mới"
        open={isCreateModalOpen}
        onOk={async () => {
          try {
            const values = await createForm.validateFields();
            const token = await getAccessTokenSilently();
            await createUser(values, token);
            message.success('Tạo user mới thành công');
            setIsCreateModalOpen(false);
            createForm.resetFields();
            fetchUsers();
          } catch (err) {
            // Hiển thị lỗi validate rõ ràng
            if (err.errorFields) {
              message.error(err.errorFields[0].errors[0]);
            } else {
              message.error('Lỗi tạo user mới');
            }
          }
        }}
        onCancel={() => setIsCreateModalOpen(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Nhập username' },
              { min: 3, message: 'Username tối thiểu 3 ký tự' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username chỉ gồm chữ, số, gạch dưới' }
            ]}
          >
            <Input placeholder="Nhập username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            initialValue="Member"
            rules={[{ required: true, message: 'Chọn role' }]}
          >
            <Select placeholder="Chọn role">
              <Option value="Member">Member</Option>
              <Option value="Coach">Coach</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="avatar"
            label="Avatar (URL)"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Đơn giản: kiểm tra url bắt đầu bằng http hoặc https
                  if (/^(https?:\/\/)[^\s]+$/.test(value)) return Promise.resolve();
                  return Promise.reject('URL không hợp lệ');
                }
              }
            ]}
          >
            <Input placeholder="Nhập URL ảnh đại diện (tùy chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 