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
    Divider, 
    Input,
    Statistic,
    Row,
    Col,
    DatePicker as AntdDatePicker
} from 'antd';
import {EyeOutlined, DeleteOutlined, DollarOutlined, UserOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    getAllUserSubscriptions,
    createUserSubscription,
    deleteUserSubscription,
    getAllUsers,
    getAllSubscriptions as getAllPlans,
    getRevenue,
    getStatistics
} from '../../utils/adminUtils';
import {useAuth0} from '@auth0/auth0-react';
import {getBackendUrl} from "../../utils/getBackendURL.js";
import {convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {useNotificationManager} from "../../hooks/useNotificationManager.jsx";

const {Option} = Select;
const {RangePicker} = AntdDatePicker;

const RevenueManagement = () => {
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
    
    // Revenue statistics
    const [revenueStats, setRevenueStats] = useState({
        totalRevenue: 0,
        totalSubscriptions: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0
    });
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [filteredData, setFilteredData] = useState([]);

    // Fetch statistics for total revenue
    const fetchStatistics = async () => {
        try {
            const token = await getAccessTokenSilently();
            const statsData = await getStatistics(token);
            const stats = statsData.stats || {};
            
            setRevenueStats(prev => ({
                ...prev,
                totalRevenue: stats.totalRevenue || 0
            }));
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    // Fetch subscriptions
    const fetchUserSubs = async () => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const data = await getAllUserSubscriptions(token);
            const subsData = data.data || data.userSubs || [];
            setUserSubs(subsData);
            
            // Calculate subscription statistics (not revenue)
            // Note: This counts from users_subscriptions table, 
            // while Statistics component counts from revenue table
            const totalSubscriptions = subsData.length;
            const activeSubs = subsData.filter(sub => 
                sub.vip_end_date && new Date(sub.vip_end_date) > new Date()
            ).length;
            
            setRevenueStats(prev => ({
                ...prev,
                totalSubscriptions,
                activeSubscriptions: activeSubs
            }));
            
            // Apply date filter
            applyDateFilter(subsData);
        } catch (err) {
            notification.error({message: 'Lỗi tải danh sách subscription'});
        } finally {
            setLoading(false);
        }
    };

    const applyDateFilter = (data) => {
        if (!dateRange || dateRange.length !== 2) {
            setFilteredData(data);
            return;
        }
        
        const filtered = data.filter(sub => {
            const purchaseDate = new Date(sub.purchased_date);
            return purchaseDate >= dateRange[0].toDate() && purchaseDate <= dateRange[1].toDate();
        });
        setFilteredData(filtered);
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
            fetchStatistics();
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    useEffect(() => {
        applyDateFilter(userSubs);
    }, [dateRange, userSubs]);

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
            await createUserSubscription(payload, token);
            openNotification('success', {message: 'Thêm subscription thành công'});
            setModalVisible(false);
            setEditingSub(null);
            form.resetFields();
            fetchUserSubs();
            fetchStatistics(); // Refresh statistics after change
        } catch (err) {
            notification.error({message: 'Lỗi khi lưu subscription'});
        }
    };

    // Delete subscription - chỉ cho phép xóa subscription còn hạn (không phải lịch sử)
    const handleDeleteSub = async (user_id, sub_id) => {
        try {
            const token = await getAccessTokenSilently();
            await deleteUserSubscription(user_id, sub_id, token);
            notification.success({message: 'Xóa subscription thành công'});
            fetchUserSubs();
            fetchStatistics(); // Refresh statistics after change
        } catch (err) {
            notification.error({message: 'Lỗi khi xóa subscription'});
        }
    };

    // Open modal for create
    const openCreateModal = () => {
        setEditingSub(null);
        setModalVisible(true);
        form.resetFields();
        setSelectedSubscription(0); // Reset selected subscription
    };

    const handleViewSub = (sub) => {
        setViewingSub(sub);
        setIsViewModalOpen(true);
    };

    const handleSubChange = (e) => {
        setSelectedSubscription(e);
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_, r) => (
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <Avatar src={r.avatar} size={32}/>
                    <div>
                        <div style={{fontWeight: 600}}>{r.username}</div>
                        <div style={{fontSize: 12, color: '#666'}}>{r.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Gói Subscription',
            key: 'subscription',
            render: (_, r) => (
                <div>
                    <div style={{fontWeight: 600}}>{r.sub_name}</div>
                    <div style={{fontSize: 12, color: '#666'}}>{r.price?.toLocaleString()} đ</div>
                </div>
            ),
        },
        {
            title: 'Ngày mua',
            dataIndex: 'purchased_date',
            key: 'purchased_date',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'vip_end_date',
            key: 'vip_end_date',
            render: (date) => {
                if (!date) return '-';
                const endDate = new Date(date);
                const isExpired = endDate < new Date();
                return (
                    <div>
                        <div style={{color: isExpired ? '#ff4d4f' : '#52c41a'}}>
                            {endDate.toLocaleDateString('vi-VN')}
                        </div>
                        <Tag color={isExpired ? 'red' : 'green'} size="small">
                            {isExpired ? 'Hết hạn' : 'Đang hoạt động'}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, r) => {
                const isActive = r.vip_end_date && new Date(r.vip_end_date) > new Date();
                return (
                    <div style={{display: 'flex', gap: 8}}>
                        <Button icon={<EyeOutlined/>} size="small" onClick={() => handleViewSub(r)}/>
                        {isActive && (
                            <Popconfirm title="Bạn có chắc muốn xóa subscription này?"
                                        onConfirm={() => handleDeleteSub(r.user_id, r.sub_id)} okText="Xóa" cancelText="Hủy">
                                <Button icon={<DeleteOutlined/>} size="small" danger/>
                            </Popconfirm>
                        )}
                    </div>
                );
            },
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Quản lý Doanh thu</h2>
                    <p className="text-gray-600">Theo dõi và quản lý lịch sử subscription của users</p>
                </div>
                <Button type="primary" onClick={openCreateModal}>
                    Thêm subscription
                </Button>
            </div>

            {/* Revenue Statistics */}
            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={revenueStats.totalRevenue}
                            precision={0}
                            valueStyle={{color: '#3f8600'}}
                            prefix={<DollarOutlined/>}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng subscription"
                            value={revenueStats.totalSubscriptions}
                            valueStyle={{color: '#1890ff'}}
                            prefix={<UserOutlined/>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Subscription đang hoạt động"
                            value={revenueStats.activeSubscriptions}
                            valueStyle={{color: '#52c41a'}}
                            prefix={<UserOutlined/>}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Date Filter */}
            <div className="mb-4">
                <div className="flex items-center gap-4">
                    <span className="font-medium">Lọc theo thời gian:</span>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="DD/MM/YYYY"
                        placeholder={['Từ ngày', 'Đến ngày']}
                    />
                    <Button onClick={() => setDateRange([dayjs().subtract(30, 'days'), dayjs()])}>
                        Tháng này
                    </Button>
                    <Button onClick={() => setDateRange([dayjs().subtract(90, 'days'), dayjs()])}>
                        3 tháng gần đây
                    </Button>
                    <Button onClick={() => setDateRange(null)}>
                        Tất cả
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={r => `${r.user_id}_${r.sub_id}`}
                loading={loading}
                pagination={{pageSize: 10}}
                bordered
            />

            {/* View Modal */}
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
                            }}><b>Giá:</b> {viewingSub.price?.toLocaleString()} đ</div>
                        </div>
                    </Card>
                )}
            </Modal>

            {/* Create/Edit Modal */}
            <Modal
                title="Thêm Subscription mới"
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingSub(null);
                    form.resetFields();
                }}
                onOk={handleSaveSub}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="user_id"
                        label="Chọn User"
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
                        name="sub_id"
                        label="Chọn Gói"
                        rules={[{required: true, message: 'Vui lòng chọn gói'}]}
                    >
                        <Select showSearch placeholder="Chọn gói" onChange={(e) => handleSubChange(e)}>
                            {plans.map((p) => (
                                <Option key={p.sub_id} value={p.sub_id}>{p.sub_name || p.sub_id}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {selectedSubscription !== 0 && (
                        <>
                            <label>Ngày bắt đầu:</label>
                            <div className='mb-5 ml-3'>{convertYYYYMMDDStrToDDMMYYYYStr(getCurrentUTCDateTime().toISOString().split('T')[0])}</div>
                            <label>Ngày kết thúc:</label>
                            <div className='mb-5 ml-3'>{getEndDate()}</div>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default RevenueManagement; 