import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAllComments, deleteComment } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const columns = [
    { title: 'ID', dataIndex: 'comment_id', key: 'comment_id' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    { title: 'User', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Post', dataIndex: 'post_id', key: 'post_id' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, comment) => (
        <Popconfirm title="Xóa bình luận này?" onConfirm={() => handleDeleteComment(comment.comment_id)} okText="Xóa" cancelText="Hủy">
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
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
    </div>
  );
};

export default CommentManagement; 