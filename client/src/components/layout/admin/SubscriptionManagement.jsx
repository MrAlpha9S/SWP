import React, {useEffect, useState} from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    DatePicker,
    Select,
    notification,
    Popconfirm,
    Avatar,
    Card,
    Tag,
    Divider, Input
} from 'antd';
import {EyeOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    getAllUserSubscriptions,
    createUserSubscription,
    updateUserSubscription,
    deleteUserSubscription,
    getAllUsers,
    getAllSubscriptions as getAllPlans
} from '../../utils/adminUtils';
import {useAuth0} from '@auth0/auth0-react';
import {getBackendUrl} from "../../utils/getBackendURL.js";
import {convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {useNotificationManager} from "../../hooks/useNotificationManager.jsx";

const {Option} = Select;

const SubscriptionManagement = () => {
    const [userSubs, setUserSubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSub, setEditingSub] = useState(null);
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [plans, setPlans] = useState([]);
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [viewingSub, setViewingSub] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(0);
    const {openNotification} = useNotificationManager();

    // Fetch subscriptions
    const fetchUserSubs = async () => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const data = await getAllUserSubscriptions(token);
            setUserSubs(data.data || data.userSubs || []);
        } catch (err) {
            notification.error({message: 'Lỗi tải danh sách subscription'});
        } finally {
            setLoading(false);
        }
    };

    // Fetch users and plans for select options (giữ nguyên fetch cũ nếu chưa có API admin)
    const fetchUsersAndPlans = async () => {
        try {
            const token = await getAccessTokenSilently();
            const [userRes, planRes] = await Promise.all([
                fetch(`${getBackendUrl()}/admin/users`, {headers: {Authorization: `Bearer ${token}`}}),
                fetch(`${getBackendUrl()}/admin/subscriptions`, {headers: {Authorization: `Bearer ${token}`}}),
            ]);
            const userData = await userRes.json();
            const planData = await planRes.json();
            const filteredUsers = (userData.data || []).filter(u => u.role !== 'Admin' && u.role !== 'Coach' && ((u.vip_end_date && new Date(u.vip_end_date) < getCurrentUTCDateTime()) || u.sub_id === 1));
            setUsers(filteredUsers);
            console.log(planData);
            const filteredPlans = (planData.data || []).filter(p => p.sub_type !== 'free');
            setPlans(filteredPlans);
        } catch (err) {
            // ignore
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserSubs();
            fetchUsersAndPlans();
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    // Add or update subscription
    const handleSaveSub = async () => {
        try {
            const values = await form.validateFields();
            const token = await getAccessTokenSilently();
            const payload = {
                user_id: values.user_id,
                sub_id: values.sub_id,
                purchased_date: getCurrentUTCDateTime().toISOString(),
                end_date: getEndDate('payload'),
            };
            if (editingSub) {
                await updateUserSubscription(editingSub.user_id, editingSub.sub_id, payload, token);
                openNotification('success', {message: 'Cập nhật subscription thành công'});
            } else {
                await createUserSubscription(payload, token);
                openNotification('success', {message: 'Thêm subscription thành công'});
            }
            setModalVisible(false);
            setEditingSub(null);
            form.resetFields();
            fetchUserSubs();
        } catch (err) {
            notification.error({message: 'Lỗi khi lưu subscription'});
        }
    };

    // Delete subscription
    const handleDeleteSub = async (user_id, sub_id) => {
        try {
            const token = await getAccessTokenSilently();
            await deleteUserSubscription(user_id, sub_id, token);
            notification.success({message: 'Xóa subscription thành công'});
            fetchUserSubs();
        } catch (err) {
            notification.error({message: 'Lỗi khi xóa subscription'});
        }
    };

    // Open modal for edit
    const handleEditSub = (sub) => {
        setEditingSub(sub);
        setModalVisible(true);
        form.setFieldsValue({
            user_id: sub.user_id,
            sub_id: sub.sub_id,
            purchased_date: sub.purchased_date ? dayjs(sub.purchased_date) : null,
            end_date: sub.end_date ? dayjs(sub.end_date) : null,
        });
    };

    // Open modal for create
    const openCreateModal = () => {
        setEditingSub(null);
        setModalVisible(true);
        form.resetFields();
    };

    const handleViewSub = (sub) => {
        setViewingSub(sub);
        setIsViewModalOpen(true);
    };

    const handleSubChange = (e) => {
        setSelectedSubscription(e)
    }

    const columns = [
        {
            title: 'User', key: 'user', render: (_, r) => (
                <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Avatar src={r.avatar} size={24}/>{r.username}
        </span>
            )
        },
        {title: 'Gói', key: 'plan', render: (_, r) => r.sub_name},
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'purchased_date',
            key: 'purchased_date',
            render: t => t ? new Date(t).toLocaleDateString() : ''
        },
        {
            title: 'Ngày kết thúc',
            key: 'vip_end_date',
            render: r => r.vip_end_date ? new Date(r.vip_end_date).toLocaleDateString() : ''
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, r) => (r.vip_end_date && new Date(r.vip_end_date) > new Date() ? 'Đang hoạt động' : 'Hết hạn')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, r) => (
                <div style={{display: 'flex', gap: 8}}>
                    <Button icon={<EyeOutlined/>} size="small" onClick={() => handleViewSub(r)}/>
                    <Button disabled={r.vip_end_date && new Date(r.vip_end_date) < new Date()} icon={<EditOutlined/>}
                            size="small" onClick={() => handleEditSub(r)}/>
                    <Popconfirm title="Bạn có chắc muốn xóa subscription này?"
                                onConfirm={() => handleDeleteSub(r.user_id, r.sub_id)} okText="Xóa" cancelText="Hủy">
                        <Button disabled={r.vip_end_date && new Date(r.vip_end_date) < new Date()}
                                icon={<DeleteOutlined/>} size="small" danger/>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const getEndDate = (type) => {
        const startDate = new Date(getCurrentUTCDateTime());
        const monthsToAdd = selectedSubscription !== 1 ? selectedSubscription === 2 ? 1 : 12 : 0;
        startDate.setMonth(startDate.getMonth() + monthsToAdd);
        return type !== 'payload' ? convertYYYYMMDDStrToDDMMYYYYStr(startDate.toISOString().split('T')[0]) : startDate.toISOString();
    };


    return (
        <div className="p-6 bg-white rounded shadow min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Quản lý Subscription</h2>
                <Button type="primary" onClick={openCreateModal}>
                    Thêm subscription
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={userSubs}
                rowKey={r => `${r.user_id}_${r.sub_id}`}
                loading={loading}
                pagination={{pageSize: 10}}
                bordered
            />
            <Modal
                title={null}
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={null}
                bodyStyle={{
                    padding: 0,
                    background: 'rgba(247,249,250,0.98)',
                    borderRadius: 24,
                    boxShadow: '0 8px 32px #0002'
                }}
                style={{borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(2px)'}}
            >
                {viewingSub && (
                    <Card bordered={false} style={{
                        margin: 0,
                        borderRadius: 20,
                        boxShadow: 'none',
                        background: '#f7f9fa',
                        minWidth: 340
                    }}>
                        <div style={{marginBottom: 18}}>
                            <Tag color="green" style={{
                                fontSize: 15,
                                marginBottom: 8,
                                padding: '2px 12px',
                                borderRadius: 8
                            }}>Subscription</Tag>
                            <div style={{
                                fontWeight: 700,
                                fontSize: 20,
                                marginBottom: 8
                            }}>Gói: {viewingSub.sub_name}</div>
                            <div style={{color: '#888', fontSize: 13, marginBottom: 8}}>User: <Avatar
                                src={viewingSub.avatar} size={24}/> {viewingSub.username}</div>
                            <div style={{
                                fontSize: 15,
                                marginBottom: 8,
                                color: '#444',
                                background: '#f3f6fa',
                                borderRadius: 8,
                                padding: 10
                            }}><b>Ngày bắt
                                đầu:</b> {viewingSub.purchased_date ? new Date(viewingSub.purchased_date).toLocaleDateString() : ''}
                            </div>
                            <div style={{
                                fontSize: 15,
                                marginBottom: 8,
                                color: '#444',
                                background: '#f3f6fa',
                                borderRadius: 8,
                                padding: 10
                            }}><b>Ngày kết
                                thúc:</b> {viewingSub.vip_end_date ? new Date(viewingSub.vip_end_date).toLocaleDateString() : ''}
                            </div>
                            <div style={{
                                fontSize: 15,
                                marginBottom: 8,
                                color: '#444',
                                background: '#f3f6fa',
                                borderRadius: 8,
                                padding: 10
                            }}><b>Trạng
                                thái:</b> {viewingSub.vip_end_date && new Date(viewingSub.vip_end_date) > new Date() ? 'Đang hoạt động' : 'Hết hạn'}
                            </div>
                            <div style={{
                                fontSize: 15,
                                marginBottom: 8,
                                color: '#444',
                                background: '#f3f6fa',
                                borderRadius: 8,
                                padding: 10
                            }}><b>Giá:</b> {viewingSub.price}</div>
                        </div>
                    </Card>
                )}
            </Modal>
            <Modal
                title={editingSub ? 'Sửa subscription' : 'Thêm subscription'}
                open={modalVisible}
                onOk={handleSaveSub}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingSub(null);
                    form.resetFields();
                }}
                okText={editingSub ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="User"
                        name="user_id"
                        rules={[{required: true, message: 'Vui lòng chọn user'}]}
                    >
                        <Select showSearch placeholder="Chọn user">
                            {users.map((u) => {
                                    return <Option key={u.user_id}
                                                   value={u.user_id}>{u.username || u.email || u.user_id}</Option>
                                }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Gói"
                        name="sub_id"
                        rules={[{required: true, message: 'Vui lòng chọn gói'}]}
                    >
                        <Select showSearch placeholder="Chọn gói" onChange={(e) => handleSubChange(e)}>
                            {plans.map((p) => (
                                <Option key={p.sub_id} value={p.sub_id}>{p.sub_name || p.sub_id}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <label >Ngày bắt đầu:</label>
                    <div className='mb-5 ml-3'>{convertYYYYMMDDStrToDDMMYYYYStr(getCurrentUTCDateTime().toISOString().split('T')[0])}</div>
                    <label>Ngày kết thúc:</label>
                    <div className='mb-5 ml-3'>{getEndDate()}</div>

                </Form>
            </Modal>
        </div>
    );
};

export default SubscriptionManagement;