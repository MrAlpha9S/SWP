import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Card, Tag, Divider, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllCoaches, updateCoach, deleteCoach, getCoachUserByCoachId } from '../../utils/adminUtils';
import {  Tabs } from 'antd';
import { useAuth0 } from '@auth0/auth0-react';
import IsPendingCoach from './coachmanage/isPendingCoach';

const { Option } = Select;

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [viewingUsers, setViewingUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  // Hàm xem user liên kết coach
  const handleViewUser = async (coach) => {
    try {
      const token = await getAccessTokenSilently();
      const coachId = coach.coach_id || coach.user_id;
      const data = await getCoachUserByCoachId(coachId, token);
      setViewingUsers(data.data || []);
      setIsViewModalOpen(true);
    } catch (err) {
      message.error('Lỗi tải thông tin user');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Bio', dataIndex: 'bio', key: 'bio' },
    { title: 'Years of Exp', dataIndex: 'years_of_exp', key: 'years_of_exp' },
    { title: 'Detailed Bio', dataIndex: 'detailed_bio', key: 'detailed_bio' },
    { title: 'Motto', dataIndex: 'motto', key: 'motto' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, coach) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewUser(coach)} className="mr-2" />
          <Button icon={<EditOutlined />} onClick={() => openEditModal(coach)} className="mr-2" />
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
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Chọn role' }]}
          >
            <Select placeholder="Chọn role">
              <Option value="Coach">Coach</Option>
              <Option value="Member">Member</Option>
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
            <Input placeholder="Nhập URL ảnh đại diện (tùy chọn)" />
          </Form.Item>
          <Form.Item name="bio" label="Bio"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="years_of_exp" label="Years of Experience"><Input type="number" min={0} /></Form.Item>
          <Form.Item name="detailed_bio" label="Detailed Bio"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="motto" label="Motto"><Input /></Form.Item>
        </Form>
      </Modal>
      <Modal
        title={null}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        styles={{padding: 0, background: 'rgba(247,249,250,0.98)', borderRadius: 24, boxShadow: '0 8px 32px #0002'}}
        style={{borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(2px)'}}
      >
        <Card bordered={false} style={{margin:0, borderRadius:20, boxShadow:'none', background:'#f7f9fa', minWidth:340}}>
          <div style={{marginBottom: 18}}>
            <Tag color="blue" style={{fontSize:15, marginBottom:8, padding:'2px 12px', borderRadius:8}}>Danh sách User liên kết Coach</Tag>
            <Divider style={{margin:'16px 0'}}/>
            {viewingUsers.length === 0 && <div style={{color:'#888'}}>Không có user liên kết</div>}
            {viewingUsers.map((user, idx) => (
              <div key={user.user_id || idx} style={{marginBottom:16, background:'#fff', borderRadius:12, padding:12, boxShadow:'0 2px 8px #0001'}}>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <Avatar src={user.avatar} size={40} style={{background:'#eee', color:'#555'}}>
                    {user.username ? user.username[0] : 'U'}
                  </Avatar>
                  <div>
                    <div style={{fontWeight:600, fontSize:16}}>
                      {user.user_id ? user.username : <span style={{color:'red'}}>User đã bị xóa</span>}
                    </div>
                    <div style={{color:'#888', fontSize:13}}>
                      {user.user_id ? user.email : ''}
                    </div>
                    <div style={{color:'#888', fontSize:13}}>
                      {user.user_id ? user.role : ''}
                    </div>
                    <div style={{color:'#444', fontSize:13}}>
                      <b>Ngày bắt đầu:</b> {user.started_date ? new Date(user.started_date).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default CoachManagement; 