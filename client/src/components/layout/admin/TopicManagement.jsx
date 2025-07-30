import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Popconfirm, Card, Tag, Divider } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const [viewingTopic, setViewingTopic] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
      let payload;
      if (editingTopic) {
        payload = {
          topic_name: values.name,
          topic_content: values.description
        };
        await updateTopic(editingTopic.topic_id, payload, token);
        notification.success({ message: 'Cập nhật chủ đề thành công' });
      } else {
        payload = {
          topic_id: values.topic_id,
          topic_name: values.name,
          topic_content: values.description
        };
        await createTopic(payload, token);
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
      name: topic.topic_name,
      description: topic.topic_content,
    });
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingTopic(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleViewTopic = (topic) => {
    setViewingTopic(topic);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'topic_id',
      key: 'topic_id',
      width: 80,
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'topic_name',
      key: 'topic_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'topic_content',
      key: 'topic_content',
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
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewTopic(record)} />
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa chủ đề này?"
            onConfirm={() => handleDelete(record.topic_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
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
        title={null}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        bodyStyle={{ padding: 0, background: 'rgba(247,249,250,0.98)', borderRadius: 24, boxShadow: '0 8px 32px #0002' }}
        style={{ borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(2px)' }}
      >
        {viewingTopic && (
          <Card bordered={false} style={{ margin: 0, borderRadius: 20, boxShadow: 'none', background: '#f7f9fa', minWidth: 340 }}>
            <div style={{ marginBottom: 18 }}>
              <Tag color="blue" style={{ fontSize: 15, marginBottom: 8, padding: '2px 12px', borderRadius: 8 }}>Chủ đề</Tag>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{viewingTopic.topic_name}</div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>ID: {viewingTopic.topic_id}</div>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ fontSize: 15, marginBottom: 8, color: '#444', background: '#f3f6fa', borderRadius: 8, padding: 10 }}><b>Mô tả:</b> {viewingTopic.topic_content}</div>
              <div style={{ fontSize: 15, marginBottom: 8, color: '#444', background: '#f3f6fa', borderRadius: 8, padding: 10 }}><b>Số bài viết:</b> {viewingTopic.postCount}</div>
            </div>
          </Card>
        )}
      </Modal>
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
          {!editingTopic && (
            <Form.Item
              label="ID chủ đề"
              name="topic_id"
              rules={[{ required: true, message: 'Vui lòng nhập ID chủ đề' }]}
            >
              <Input />
            </Form.Item>
          )}
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