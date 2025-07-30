import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification, Popconfirm, Card, Divider, Avatar, Tag } from 'antd';
import { getAllCheckIns, getCheckInById, deleteCheckIn } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const CheckinManagement = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch checkins
  const fetchCheckins = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllCheckIns(token);
      setCheckins(data.checkins || data.data || []);
    } catch (err) {
      notification.error({ message: 'Lỗi tải danh sách check-in' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCheckins();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Delete checkin
  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteCheckIn(id, token);
      notification.success({ message: 'Xóa check-in thành công' });
      fetchCheckins();
    } catch (err) {
      notification.error({ message: 'Lỗi khi xóa check-in' });
    }
  };

  // Open detail modal
  const openDetailModal = async (checkin) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getCheckInById(checkin.id, token);
      setSelectedCheckin(data.checkin || data.data || checkin);
      setDetailModal(true);
    } catch (err) {
      setSelectedCheckin(checkin);
      setDetailModal(true);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'log_id', key: 'log_id', width: 80 },
    { title: 'User', dataIndex: 'username', key: 'username', render: (text, record) => record.username || record.user_id },
    { title: 'Ngày check-in', dataIndex: 'logged_at', key: 'logged_at', render: (text) => text ? new Date(text).toLocaleString() : '', width: 160 },
    { title: 'Cảm xúc', dataIndex: 'feeling', key: 'feeling' },
    { title: 'Số điếu', dataIndex: 'cigs_smoked', key: 'cigs_smoked' },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 100,
    //   render: (text) => text === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành',
    // },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div style={{display:'flex', gap:8}}>
          <Button icon={<EyeOutlined />} size="small" onClick={() => openDetailModal(record)} />
          {/* <Popconfirm
            title="Bạn có chắc muốn xóa check-in này?"
            onConfirm={() => handleDelete(record.log_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý Check-in</h2>
      </div>
      <Table
        columns={columns}
        dataSource={checkins}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title="Chi tiết Check-in"
        open={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={null}
      >
        {selectedCheckin && (
          <Card bordered={false}>
            <div className="flex items-center gap-3 mb-2">
              <Avatar style={{ backgroundColor: '#87d068' }}>
                {selectedCheckin.username ? selectedCheckin.username[0]?.toUpperCase() : (selectedCheckin.user_id ? selectedCheckin.user_id[0]?.toUpperCase() : '?')}
              </Avatar>
              <div>
                <div className="font-semibold text-base">{selectedCheckin.username || selectedCheckin.user_id}</div>
                <div className="text-xs text-gray-500">User</div>
              </div>
            </div>
            <Divider className="my-2" />
            <div className="mb-1"><b>ID:</b> {selectedCheckin.log_id}</div>
            <div className="mb-1"><b>Ngày check-in:</b> {selectedCheckin.logged_at ? new Date(selectedCheckin.logged_at).toLocaleString() : ''}</div>
            {/* <div className="mb-1 flex items-center gap-2">
              <b>Trạng thái:</b>
              <Tag color={selectedCheckin.status === 'completed' ? 'green' : 'orange'}>
                {selectedCheckin.status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
              </Tag>
            </div> */}
            <div className="mb-1"><b>Cảm xúc:</b> {selectedCheckin.feeling || '-'}</div>
            <div className="mb-1"><b>Số điếu:</b> {selectedCheckin.cigs_smoked ?? '-'}</div>
            <Divider className="my-2" />
            <div className="mb-1"><b>Nội dung:</b></div>
            <div className="whitespace-pre-line bg-gray-50 p-2 rounded border min-h-[40px]">{selectedCheckin.content || '-'}</div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default CheckinManagement; 