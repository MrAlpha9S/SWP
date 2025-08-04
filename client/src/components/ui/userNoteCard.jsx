import {Card, Typography, Button, Space, Input, Modal, Popconfirm} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    CloseOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../utils/dateUtils.js";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const UserNoteCard = ({ note, onEdit, onDelete }) => {
    const [isEditing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);

    const handleEdit = () => {
        setEditedContent(note.content);
        setEditing(true);
    };

    const handleSave = () => {
        if (!editedContent.trim()) {
            return; // extra safety, but validated already in parent
        }
        onEdit({ ...note, content: editedContent });
        setEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(note.content);
        setEditing(false);
    };

    return (
        <Card
            title={
                <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>Ghi chú #{note.note_id}</span>
                    <Space>
                        {isEditing ? (
                            <>
                                <Button icon={<SaveOutlined />} size="small" type="primary" onClick={handleSave}>
                                    Lưu
                                </Button>
                                <Button icon={<CloseOutlined />} size="small" onClick={handleCancel}>
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button icon={<EditOutlined />} size="small" onClick={handleEdit}>
                                    Sửa
                                </Button>
                                <Popconfirm title='Bạn có chắc muốn xóa?' onConfirm={() => onDelete(note.note_id)}>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        size="small"
                                    >
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </>
                        )}
                    </Space>
                </Space>
            }
            bordered
            style={{ marginBottom: '1rem' }}
        >
            {isEditing ? (
                <TextArea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    autoSize={{ minRows: 3 }}
                />
            ) : (
                <Paragraph>{note.content}</Paragraph>
            )}

            <Text type="secondary">
                Tạo bởi <Text strong>{note.created_by_username}</Text> vào lúc{' '}
                {convertYYYYMMDDStrToDDMMYYYYStr(note.created_at.split('T')[0])}
            </Text>
            <br />
            {note.updated_at && (
                <Text type="secondary">
                    Sửa bởi <Text strong>{note.updated_by_username}</Text> vào lúc{' '}
                    {convertYYYYMMDDStrToDDMMYYYYStr(note.updated_at.split('T')[0])}
                </Text>
            )}
        </Card>
    );
};

export default UserNoteCard;
