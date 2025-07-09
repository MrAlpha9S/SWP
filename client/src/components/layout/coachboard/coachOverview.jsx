import { UsergroupAddOutlined, DollarOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Card } from 'antd';
import {RiUserCommunityLine} from "react-icons/ri";
import {MdOutlineReportGmailerrorred} from "react-icons/md";
const chartData = [
    { date: '01/07', users: 3, commission: 120000 },
    { date: '02/07', users: 5, commission: 200000 },
    { date: '03/07', users: 8, commission: 350000 },
    { date: '04/07', users: 10, commission: 500000 },
    { date: '05/07', users: 12, commission: 700000 },
];

export default function CoachOverview({ stats }) {
    return (
        <div className="bg-[#d5fdf3] rounded-md p-6 space-y-8">
            <h2 className="text-lg font-semibold text-center">Tổng quan huấn luyện viên</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<UsergroupAddOutlined />} value={stats.subscribedUserCount} label="Người dùng đã đăng ký" />
                <StatCard icon={<DollarOutlined />} value={`${stats.totalCommission.toLocaleString()} VNĐ`} label="Tổng hoa hồng" />
                <StatCard icon={<FileTextOutlined />} value={stats.approvedBlogPostCount} label="Bài blog đã đăng" />
                <StatCard icon={<ClockCircleOutlined />} value={stats.pendingBlogPostCount} label="Bài blog chờ duyệt" />
                <StatCard icon={<RiUserCommunityLine />} value={stats.pendingSocialPostCount} label="Bài viết cộng đồng chờ duyệt" />
                <StatCard icon={<MdOutlineReportGmailerrorred />} value={stats.reportCount} label="Báo cáo bài viết cộng đồng chờ duyệt" />
            </div>

            {/* Chart */}
            <div className="w-full h-80 bg-white rounded-md p-4 shadow">
                <h3 className="text-md font-semibold text-center mb-4">Biểu đồ người đăng ký & hoa hồng</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" label={{ value: 'Người dùng', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'VNĐ', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" name="Người dùng" />
                        <Line yAxisId="right" type="monotone" dataKey="commission" stroke="#82ca9d" name="Hoa hồng (VNĐ)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StatCard({ icon, value, label }) {
    return (
        <Card
            bordered={false}
            className="bg-[#baf2e4] text-center shadow-md"
            bodyStyle={{ padding: 20 }}
            hoverable
        >
            <div className="text-2xl mb-2 flex justify-center">{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-700">{label}</p>
        </Card>
    );
}

