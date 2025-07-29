import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Form, Input, Card, Tag, Divider, Avatar, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllPosts, getPostById, deletePost, getPostLikes, getCommentsByPostId  } from '../../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

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
      // Lấy likes
      const likeRes = await getPostLikes(post_id, token);
      setLikes(likeRes.data || []);
      // Lấy comments
      //const commentData = await getCommentsByPostId(post_id, token);
      //setComments(commentData || []);
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
    { title: 'Chủ đề', dataIndex: 'category_name', key: 'category_name' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
    },
    { title: 'User đăng', dataIndex: 'username', key: 'username' },
    { title: 'Like', dataIndex: 'likes', key: 'likes' },
    { title: 'Comment', dataIndex: 'comments', key: 'comments' },
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
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        bodyStyle={{padding: 0, background: 'rgba(247,249,250,0.98)', borderRadius: 24, boxShadow: '0 8px 32px #0002'}}
        style={{borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(2px)'}}
      >
        {viewingPost ? (
          <Card bordered={false} style={{margin:0, borderRadius:20, boxShadow:'none', background:'#f7f9fa', minWidth:340}}>
            <div style={{marginBottom: 18}}>
              <Tag color="blue" style={{fontSize:15, marginBottom:8, padding:'2px 12px', borderRadius:8}}>{viewingPost.category_name}</Tag>
              <div style={{fontWeight:700, fontSize:22, marginBottom:8}}>{viewingPost.title}</div>
              <div style={{color:'#888', fontSize:13, marginBottom:8}}>ID: {viewingPost.post_id}</div>
              <div style={{fontSize:15, marginBottom:8, color:'#444', background:'#f3f6fa', borderRadius:8, padding:10}}><b>Nội dung:</b> {viewingPost.content}</div>
              <div style={{color:'#888', fontSize:13, marginBottom:8}}>
                Ngày tạo: {viewingPost?.created_at ? dayjs(viewingPost.created_at).format('DD/MM/YYYY HH:mm') : ''}
              </div>
            </div>
            <Divider style={{margin:'16px 0'}}/>
            <div style={{fontWeight:600, marginBottom:8, fontSize:16}}>User đăng</div>
            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
              <Avatar src={viewingPost.avatar} size={56} style={{border:'2px solid #e6f4ff'}} />
          <div>
                <div style={{fontWeight:600, fontSize:17}}>{viewingPost.username}</div>
              </div>
            </div>
            <Divider style={{margin:'16px 0'}}/>
            <div style={{fontWeight:600, marginBottom:8, fontSize:16}}>User đã like ({likes.length})</div>
            <Avatar.Group maxCount={8} maxStyle={{color:'#f56a00', backgroundColor:'#fde3cf', border:'2px solid #fff'}}>
              {likes.length === 0 && <span style={{color:'#888'}}>Chưa có ai like</span>}
              {likes.map(u => (
                <Tooltip title={<span><b>{u.username}</b><br/>{u.email}</span>} key={u.user_id}>
                  <Avatar src={u.avatar} size={40} style={{marginRight:6, border:'2px solid #e6f4ff'}}>{u.username?.[0]?.toUpperCase()}</Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
            <Divider style={{margin:'16px 0'}}/>
            <div style={{fontWeight:600, marginBottom:8, fontSize:16}}>Comment ({comments.length})</div>
            {comments.length === 0 && <span style={{color:'#888'}}>Chưa có comment</span>}
            <div style={{display:'flex', flexDirection:'column', gap:18}}>
              {comments.map(c => (
                <Card key={c.comment_id} size="small" style={{borderRadius:16, background:'#fff', boxShadow:'0 2px 8px #0001', margin:0, border:'1px solid #f0f0f0'}} bodyStyle={{padding:14}}>
                  <div style={{display:'flex', alignItems:'flex-start', gap:14}}>
                    <Avatar src={c.avatar} size={36} style={{marginTop:2, border:'2px solid #e6f4ff'}}>{c.username?.[0]?.toUpperCase()}</Avatar>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, fontSize:15, marginBottom:2}}>{c.username}</div>
                      <div style={{fontSize:14, margin:'2px 0 6px 0', lineHeight:1.5}}>{c.content}</div>
                      <div style={{fontSize:11, color:'#888'}}>
                        {c.created_at ? dayjs(c.created_at).format('DD/MM/YYYY HH:mm') : ''}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
          </Card>
        ) : <p style={{padding:32}}>Không có dữ liệu</p>}
      </Modal>
    </div>
  );
};

export default PostManagement;