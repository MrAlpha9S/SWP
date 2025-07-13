import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification, Popconfirm } from 'antd';
import { getAllCheckIns, getCheckInById, deleteCheckIn } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

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
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => record.userName || record.userId,
    },
    {
      title: 'Ngày check-in',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text ? new Date(text).toLocaleString() : '',
      width: 160,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => text && text.length > 40 ? text.slice(0, 40) + '...' : text,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => text === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => openDetailModal(record)}>
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa check-in này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
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
          <div className="space-y-2">
            <div><b>ID:</b> {selectedCheckin.id}</div>
            <div><b>User:</b> {selectedCheckin.userName || selectedCheckin.userId}</div>
            <div><b>Ngày check-in:</b> {selectedCheckin.date ? new Date(selectedCheckin.date).toLocaleString() : ''}</div>
            <div><b>Trạng thái:</b> {selectedCheckin.status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}</div>
            <div><b>Nội dung:</b></div>
            <div className="whitespace-pre-line bg-gray-50 p-2 rounded border">{selectedCheckin.content}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CheckinManagement; 