import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllBlogs, getBlogById, deleteBlog } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllBlogs(token);
      setBlogs(data.data || data.blogs || []);
    } catch (err) {
      message.error('Lỗi tải danh sách blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchBlogs();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Xem chi tiết blog
  const handleViewBlog = async (blog_id) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getBlogById(blog_id, token);
      setViewingBlog(data.data || data.blog || null);
      setIsModalOpen(true);
    } catch (err) {
      message.error('Lỗi tải chi tiết blog');
    }
  };

  // Xóa blog
  const handleDeleteBlog = async (blog_id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteBlog(blog_id, token);
      message.success('Xóa blog thành công');
      fetchBlogs();
    } catch (err) {
      message.error('Lỗi xóa blog');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'blog_id', key: 'blog_id' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    { title: 'User', dataIndex: 'auth0_id', key: 'auth0_id' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, blog) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewBlog(blog.blog_id)} className="mr-2" />
          <Popconfirm title="Xóa blog này?" onConfirm={() => handleDeleteBlog(blog.blog_id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Blog</h2>
      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="blog_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Chi tiết Blog"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {viewingBlog ? (
          <div>
            <p><strong>Tiêu đề:</strong> {viewingBlog.title}</p>
            <p><strong>Mô tả:</strong> {viewingBlog.description}</p>
            <p><strong>Nội dung:</strong> {viewingBlog.content}</p>
            <p><strong>Ngày tạo:</strong> {viewingBlog.created_at}</p>
            <p><strong>User:</strong> {viewingBlog.auth0_id}</p>
          </div>
        ) : <p>Không có dữ liệu</p>}
      </Modal>
    </div>
  );
};

export default BlogManagement; 