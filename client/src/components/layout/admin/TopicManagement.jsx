import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Popconfirm } from 'antd';
import { getAllTopics, createTopic, updateTopic, deleteTopic } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const { TextArea } = Input;

const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form] = Form.useForm();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch topics
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllTopics(token);
      setTopics(data.topics || data.data || []);
    } catch (err) {
      notification.error({ message: 'Lỗi tải danh sách chủ đề' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchTopics();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Add or update topic
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = await getAccessTokenSilently();
      if (editingTopic) {
        // Update
        await updateTopic(editingTopic.id, values, token);
        notification.success({ message: 'Cập nhật chủ đề thành công' });
      } else {
        // Create
        await createTopic(values, token);
        notification.success({ message: 'Thêm chủ đề thành công' });
      }
      setModalVisible(false);
      setEditingTopic(null);
      form.resetFields();
      fetchTopics();
    } catch (err) {
      notification.error({ message: 'Lỗi khi lưu chủ đề' });
    }
  };

  // Delete topic
  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteTopic(id, token);
      notification.success({ message: 'Xóa chủ đề thành công' });
      fetchTopics();
    } catch (err) {
      notification.error({ message: 'Lỗi khi xóa chủ đề' });
    }
  };

  // Open modal for edit
  const openEditModal = (topic) => {
    setEditingTopic(topic);
    setModalVisible(true);
    form.setFieldsValue({
      name: topic.name,
      description: topic.description,
    });
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingTopic(null);
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
      title: 'Tên chủ đề',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 120,
      render: (text, record) => record.postCount || 0,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text) => new Date(text).toLocaleString(),
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
            title="Bạn có chắc muốn xóa chủ đề này?"
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
        <h2 className="text-xl font-bold">Quản lý chủ đề</h2>
        <Button type="primary" onClick={openCreateModal}>
          Thêm chủ đề
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={topics}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title={editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setEditingTopic(null);
          form.resetFields();
        }}
        okText={editingTopic ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên chủ đề"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicManagement; 