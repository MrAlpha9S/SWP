import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, notification, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const { Option } = Select;

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllSubscriptions(token);
      setSubscriptions(data.subscriptions || data.data || []);
    } catch (err) {
      notification.error({ message: 'Lỗi tải danh sách subscription' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users and plans for select options (giữ nguyên fetch cũ nếu chưa có API admin)
  const fetchUsersAndPlans = async () => {
    try {
      const [userRes, planRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/plans'),
      ]);
      const userData = await userRes.json();
      const planData = await planRes.json();
      setUsers(userData.users || []);
      setPlans(planData.plans || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions();
      fetchUsersAndPlans();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Add or update subscription
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };
      const token = await getAccessTokenSilently();
      if (editingSub) {
        // Update
        await updateSubscription(editingSub.id, payload, token);
        notification.success({ message: 'Cập nhật subscription thành công' });
      } else {
        // Create
        await createSubscription(payload, token);
        notification.success({ message: 'Thêm subscription thành công' });
      }
      setModalVisible(false);
      setEditingSub(null);
      form.resetFields();
      fetchSubscriptions();
    } catch (err) {
      notification.error({ message: 'Lỗi khi lưu subscription' });
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteSubscription(id, token);
      notification.success({ message: 'Xóa subscription thành công' });
      fetchSubscriptions();
    } catch (err) {
      notification.error({ message: 'Lỗi khi xóa subscription' });
    }
  };

  // Open modal for edit
  const openEditModal = (sub) => {
    setEditingSub(sub);
    setModalVisible(true);
    form.setFieldsValue({
      userId: sub.userId,
      planId: sub.planId,
      startDate: dayjs(sub.startDate),
      endDate: dayjs(sub.endDate),
      status: sub.status,
    });
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingSub(null);
    setModalVisible(true);
    form.resetFields();
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
      title: 'Gói',
      dataIndex: 'plan',
      key: 'plan',
      render: (text, record) => record.planName || record.planId,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? new Date(text).toLocaleDateString() : '',
      width: 120,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => text ? new Date(text).toLocaleDateString() : '',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => text === 'active' ? 'Đang hoạt động' : 'Hết hạn',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa subscription này?"
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
        <h2 className="text-xl font-bold">Quản lý Subscription</h2>
        <Button type="primary" onClick={openCreateModal}>
          Thêm subscription
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={subscriptions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title={editingSub ? 'Sửa subscription' : 'Thêm subscription'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setEditingSub(null);
          form.resetFields();
        }}
        okText={editingSub ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="User"
            name="userId"
            rules={[{ required: true, message: 'Vui lòng chọn user' }]}
          >
            <Select showSearch placeholder="Chọn user">
              {users.map((u) => (
                <Option key={u.id} value={u.id}>{u.username || u.email || u.id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Gói"
            name="planId"
            rules={[{ required: true, message: 'Vui lòng chọn gói' }]}
          >
            <Select showSearch placeholder="Chọn gói">
              {plans.map((p) => (
                <Option key={p.id} value={p.id}>{p.name || p.id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="startDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="active">Đang hoạt động</Option>
              <Option value="expired">Hết hạn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement; 