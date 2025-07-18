import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Avatar, Card, Tag, Divider } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllComments, deleteComment } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingComment, setViewingComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAllComments(token);
      setComments(data.data || data.comments || []);
    } catch (err) {
      message.error('Lỗi tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchComments();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Xóa bình luận
  const handleDeleteComment = async (comment_id) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteComment(comment_id, token);
      message.success('Xóa bình luận thành công');
      fetchComments();
    } catch (err) {
      message.error('Lỗi xóa bình luận');
    }
  };

  const handleViewComment = (comment) => {
    setViewingComment(comment);
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'comment_id', key: 'comment_id' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    { title: 'User', key: 'username', render: (_, c) => (
        <span style={{display:'flex', alignItems:'center', gap:8}}>
          <Avatar src={c.avatar} size={24} />
          {c.username}
        </span>
      ) },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, comment) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewComment(comment)} className="mr-2" />
          <Popconfirm title="Xóa bình luận này?" onConfirm={() => handleDeleteComment(comment.comment_id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Bình luận</h2>
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="comment_id"
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
        {viewingComment && (
          <Card bordered={false} style={{margin:0, borderRadius:20, boxShadow:'none', background:'#f7f9fa', minWidth:340}}>
            <div style={{marginBottom: 18}}>
              <Tag color="blue" style={{fontSize:15, marginBottom:8, padding:'2px 12px', borderRadius:8}}>{viewingComment.post_title}</Tag>
              <div style={{color:'#888', fontSize:13, marginBottom:4}}>ID bài viết: {viewingComment.post_id}</div>
              {viewingComment.post_content && (
                <div style={{fontSize:15, marginBottom:8, color:'#444', background:'#f3f6fa', borderRadius:8, padding:10}}>
                  <b>Nội dung bài viết:</b> {viewingComment.post_content}
                </div>
              )}
              <div style={{fontWeight:700, fontSize:20, marginBottom:8}}>Bình luận</div>
              <div style={{fontSize:16, background:'#f6f6f6', borderRadius:8, padding:14, marginBottom:8, lineHeight:1.6}}>{viewingComment.content}</div>
              <div style={{color:'#888', fontSize:13, marginBottom:8}}>Ngày tạo: {new Date(viewingComment.created_at).toLocaleString()}</div>
            </div>
            <Divider style={{margin:'16px 0'}}/>
            <div style={{fontWeight:600, marginBottom:8, fontSize:16}}>User bình luận</div>
            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
              <Avatar src={viewingComment.avatar} size={56} style={{border:'2px solid #e6f4ff'}} />
              <div>
                <div style={{fontWeight:600, fontSize:17}}>{viewingComment.username}</div>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default CommentManagement; 