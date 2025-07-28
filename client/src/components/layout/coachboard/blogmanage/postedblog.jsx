import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Avatar, Card, Tag, Divider } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { getPostedBlog, getBlogById } from '../../../utils/blogUtils';
import { useAuth0 } from '@auth0/auth0-react';

const PostedBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getPostedBlog(user, getAccessTokenSilently, isAuthenticated);
      console.log('Fetched blogs:', data);
      setBlogs((data.data || data.blogs || []).filter(blog => blog.isPendingForApprovement === 0));
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


  // Handle reload
  const handleReload = () => {
    fetchBlogs();
    message.success('Làm mới danh sách blog chờ duyệt');
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
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý Blog</h2>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleReload}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>
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
              <div style={{fontSize:15, marginBottom:8, color:'#444', background:'#f3f6fa', borderRadius:8, padding:10}}><b>Nội dung:</b> 
              <span dangerouslySetInnerHTML={{ __html: viewingBlog.content }} />
              </div>
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

export default PostedBlog;