import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllPosts, getPostById, deletePost } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllPosts(token);
      setPosts(data.data || data.posts || []);
    } catch (err) {
      message.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPosts();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Xem chi tiết bài viết
  const handleViewPost = async (post_id) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getPostById(post_id, token);
      setViewingPost(data.data || data.post || null);
      setIsModalOpen(true);
    } catch (err) {
      message.error('Lỗi tải chi tiết bài viết');
    }
  };

  // Xóa bài viết
  const handleDeletePost = async (post_id) => {
    try {
      const token = await getAccessTokenSilently();
      await deletePost(post_id, token);
      message.success('Xóa bài viết thành công');
      fetchPosts();
    } catch (err) {
      message.error('Lỗi xóa bài viết');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'post_id', key: 'post_id' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    { title: 'User', dataIndex: 'username', key: 'username' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, post) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewPost(post.post_id)} className="mr-2" />
          <Popconfirm title="Xóa bài viết này?" onConfirm={() => handleDeletePost(post.post_id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Bài viết</h2>
      <Table
        dataSource={posts}
        columns={columns}
        rowKey="post_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Chi tiết bài viết"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {viewingPost ? (
          <div>
            <p><strong>Tiêu đề:</strong> {viewingPost.title}</p>
            <p><strong>Nội dung:</strong> {viewingPost.content}</p>
            <p><strong>Ngày tạo:</strong> {viewingPost.created_at}</p>
            <p><strong>User:</strong> {viewingPost.username}</p>
          </div>
        ) : <p>Không có dữ liệu</p>}
      </Modal>
    </div>
  );
};

export default PostManagement; 