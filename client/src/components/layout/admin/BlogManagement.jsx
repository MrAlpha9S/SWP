import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Avatar, Card, Tag, Divider } from 'antd';
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
    { title: 'User', key: 'username', render: (_, b) => (
        <span style={{display:'flex', alignItems:'center', gap:8}}>
          <Avatar src={b.avatar} size={24} />
          {b.username}
        </span>
      ) },
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
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        bodyStyle={{padding: 0, background: 'rgba(247,249,250,0.98)', borderRadius: 24, boxShadow: '0 8px 32px #0002'}}
        style={{borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(2px)'}}
      >
        {viewingBlog ? (
          <Card bordered={false} style={{margin:0, borderRadius:20, boxShadow:'none', background:'#f7f9fa', minWidth:340}}>
            <div style={{marginBottom: 18}}>
              <Tag color="blue" style={{fontSize:15, marginBottom:8, padding:'2px 12px', borderRadius:8}}>Blog</Tag>
              <div style={{fontWeight:700, fontSize:22, marginBottom:8}}>{viewingBlog.title}</div>
              <div style={{color:'#888', fontSize:13, marginBottom:8}}>ID: {viewingBlog.blog_id}</div>
              <div style={{fontSize:15, marginBottom:8, color:'#444', background:'#f3f6fa', borderRadius:8, padding:10}}><b>Mô tả:</b> {viewingBlog.description}</div>
              <div style={{fontSize:15, marginBottom:8, color:'#444', background:'#f3f6fa', borderRadius:8, padding:10}}><b>Nội dung:</b> {viewingBlog.content}</div>
              <div style={{color:'#888', fontSize:13, marginBottom:8}}>Ngày tạo: {viewingBlog.created_at ? new Date(viewingBlog.created_at).toLocaleString() : ''}</div>
            </div>
            <Divider style={{margin:'16px 0'}}/>
            <div style={{fontWeight:600, marginBottom:8, fontSize:16}}>User đăng</div>
            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
              <Avatar src={viewingBlog.avatar} size={56} style={{border:'2px solid #e6f4ff'}} />
              <div>
                <div style={{fontWeight:600, fontSize:17}}>{viewingBlog.username}</div>
              </div>
            </div>
          </Card>
        ) : <p style={{padding:32}}>Không có dữ liệu</p>}
      </Modal>
    </div>
  );
};

export default BlogManagement; 