import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, Popconfirm, message, Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getAllUsers, updateUser, deleteUser, toggleBanUser, createUser } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { getCoachUserByCoachId } from '../../utils/adminUtils';


const { Option } = Select;
const { Text } = Typography;

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
  const [createPassword, setCreatePassword] = useState('');
  const [isSocial, setIsSocial] = useState(false);

  // Password validation function
  const validatePasswordRequirements = (password) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const categoriesMet = [
      requirements.lowercase,
      requirements.uppercase,
      requirements.numbers,
      requirements.special
    ].filter(Boolean).length;

    return {
      ...requirements,
      categoriesMet,
      isValid: requirements.length && categoriesMet >= 3
    };
  };

  // Custom password validator
  const customPasswordValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Nhập mật khẩu!'));
    }

    const validation = validatePasswordRequirements(value);

    if (!validation.length) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự!'));
    }

    if (validation.categoriesMet < 3) {
      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 3 trong 4 loại ký tự!'));
    }

    return Promise.resolve();
  };



  // Hàm mở modal tạo user mới và reset form
  const openCreateModal = () => {
    createForm.resetFields();
    setCreatePassword('');
    setIsCreateModalOpen(true);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setCreatePassword(e.target.value);
  };

  // Password requirement item component
  const RequirementItem = ({ met, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      {met ? (
        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
      ) : (
        <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
      )}
      <Text style={{ color: met ? '#52c41a' : '#ff4d4f', fontSize: '12px' }}>
        {children}
      </Text>
    </div>
  );

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
    setIsSocial(user.is_social === 1); // Lưu trạng thái is_social
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
      const user = users.find(u => u.user_id === user_id);
      if (user.role === 'Coach') {
        const token = await getAccessTokenSilently();
        const res = await getCoachUserByCoachId(user_id, token);
        if (res.data && res.data.length > 0) {
          message.error('Không thể xóa huấn luyện viên đã có học viên liên kết!');
          return;
        }
      }
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
      await toggleBanUser(user.user_id, !user.isBanned, token);
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
          <Popconfirm title="Xóa user này?" onConfirm={() => handleDeleteUser(user.user_id)} okText="Xóa"
            cancelText="Hủy">
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

  const requirements = validatePasswordRequirements(createPassword);

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
        {isSocial && (
          <div style={{ color: 'orange', marginBottom: 8 }}>
            Một số trường không thể chỉnh sửa với tài khoản mạng xã hội (Email, Avatar).
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Nhập username' }
            ]}
          >
            <Input placeholder="Nhập username" disabled={isSocial} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" disabled={isSocial} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
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
                  if (/^(https?:\/\/)[^\s]+$/.test(value)) return Promise.resolve();
                  return Promise.reject('URL không hợp lệ');
                }
              }
            ]}
          >
            <Input placeholder="Nhập URL ảnh đại diện (tùy chọn)" disabled={isSocial}/>
          </Form.Item>
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
            setCreatePassword('');
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
        onCancel={() => {
          setIsCreateModalOpen(false);
          setCreatePassword('');
        }}
        okText="Tạo"
        cancelText="Hủy"
        width={600}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Nhập username' }
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
            name="password"
            label="Password"
            rules={[{ validator: customPasswordValidator }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              onChange={handlePasswordChange}
            />
          </Form.Item>

          {/* Password Requirements Display */}
          {createPassword && (
            <Card
              size="small"
              title="Yêu cầu mật khẩu"
              style={{ marginBottom: 16 }}
            >
              <RequirementItem met={requirements.length}>
                Ít nhất 8 ký tự
              </RequirementItem>

              <div style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: '12px' }}>
                  Ít nhất 3 trong các loại sau ({requirements.categoriesMet}/4):
                </Text>
              </div>

              <div style={{ paddingLeft: 16 }}>
                <RequirementItem met={requirements.lowercase}>
                  Chữ thường (a-z)
                </RequirementItem>
                <RequirementItem met={requirements.uppercase}>
                  Chữ hoa (A-Z)
                </RequirementItem>
                <RequirementItem met={requirements.numbers}>
                  Số (0-9)
                </RequirementItem>
                <RequirementItem met={requirements.special}>
                  Ký tự đặc biệt (!@#$%^&*)
                </RequirementItem>
              </div>
            </Card>
          )}

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
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