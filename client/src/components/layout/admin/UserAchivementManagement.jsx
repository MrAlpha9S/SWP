import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Table, Modal, Select, message } from 'antd';
import dayjs from 'dayjs';
import { getAllUserAchievements, addUserAchievement, getAllUsers, getAllAchievements } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const UserAchievementManagement = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedAchievement, setSelectedAchievement] = useState();
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await getAllUserAchievements(token);
      setData(res.data || []);
      const usersRes = await getAllUsers(token);
      setUsers(usersRes.data || []);
      const achRes = await getAllAchievements(token);
      setAchievements(achRes.data || []);
    } catch {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!selectedUser || !selectedAchievement) {
      message.error('Chọn user và thành tựu');
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await addUserAchievement({ user_id: selectedUser, achievement_id: selectedAchievement }, token);
      message.success('Thêm thành tựu thành công');
      setIsModalOpen(false);
      fetchData();
    } catch {
      message.error('Lỗi thêm thành tựu');
    }
  };

  const handleDelete = async (userId, achievementId) => {
    // Implement delete functionality here
  };

  const columns = [
    { title: 'User', dataIndex: 'username', key: 'username' },
    { title: 'Thành tựu', dataIndex: 'achievement_name', key: 'achievement_name' },
    { title: 'Mô tả', dataIndex: 'criteria', key: 'criteria' },
    {
      title: 'Ngày đạt',
      dataIndex: 'achieved_at',
      key: 'achieved_at',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
    },
    // {
    //   title: 'Hành động',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Popconfirm
    //       title="Xóa thành tựu này?"
    //       onConfirm={() => handleDelete(record.user_id, record.achievement_id)}
    //       okText="Xóa"
    //       cancelText="Hủy"
    //     >
    //       <Button icon={<DeleteOutlined />} danger />
    //     </Popconfirm>
    //   ),
    // },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Huy hiệu</h2>
      {/* <Button type="primary" className="mb-4" onClick={() => setIsModalOpen(true)}>
        Thêm thành tựu cho user
      </Button> */}
      <Table
        dataSource={data}
        columns={columns}
        rowKey={r => `${r.user_id}_${r.achievement_id}`}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Thêm thành tựu cho user"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Select
          style={{ width: '100%', marginBottom: 16 }}
          placeholder="Chọn user"
          onChange={setSelectedUser}
          showSearch
          optionFilterProp="children"
        >
          {users.map(u => <Select.Option key={u.user_id} value={u.user_id}>{u.username} ({u.email})</Select.Option>)}
        </Select>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn thành tựu"
          onChange={setSelectedAchievement}
          showSearch
          optionFilterProp="children"
        >
          {achievements.map(a => <Select.Option key={a.achievement_id} value={a.achievement_id}>{a.achievement_name}</Select.Option>)}
        </Select>
      </Modal>
    </div>
  );
};

export default UserAchievementManagement;