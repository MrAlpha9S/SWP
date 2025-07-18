import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Table, notification } from 'antd';
import { getStatistics } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select } from 'antd';
const { Option } = Select;

const Statistics = () => {
  const [stats, setStats] = useState({});
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [monthlyCheckins, setMonthlyCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredRevenue, setFilteredRevenue] = useState([]);

  // Fetch statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getStatistics(token);
      setStats(data.stats || {});
      setMonthlyUsers((data.stats && data.stats.monthlyUsers) || []);
      setMonthlyCheckins((data.stats && data.stats.monthlyCheckins) || []);
    } catch (err) {
      notification.error({ message: 'Lỗi tải dữ liệu thống kê' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchStats();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    if (stats.monthlyRevenue) {
      setFilteredRevenue(
        stats.monthlyRevenue.filter(item => item.month.startsWith(selectedYear.toString()))
      );
    }
  }, [stats.monthlyRevenue, selectedYear]);

  const statList = [
    { title: 'Tổng User', value: stats.userCount },
    { title: 'Tổng Coach', value: stats.coachCount },
    { title: 'Bài viết', value: stats.postCount },
    { title: 'Bình luận', value: stats.commentCount },
    { title: 'Blog', value: stats.blogCount },
    { title: 'Chủ đề', value: stats.topicCount },
    { title: 'Subscription', value: stats.subscriptionCount },
    { title: 'Check-in', value: stats.checkinCount },
    { title: 'Tổng doanh thu', value: stats.totalRevenue ? stats.totalRevenue.toLocaleString() + ' đ' : 0 },
  ];

  const columnsUser = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Số user đăng ký', dataIndex: 'count', key: 'count' },
  ];
  const columnsCheckin = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Số check-in', dataIndex: 'count', key: 'count' },
  ];

  const years = stats.monthlyRevenue
    ? Array.from(new Set(stats.monthlyRevenue.map(item => item.month.slice(0, 4))))
    : [];

  return (
    <div className="p-6 bg-white rounded shadow min-h-[400px]">
      <h2 className="text-xl font-bold mb-4">Thống kê tổng quan</h2>
      <Row gutter={[16, 16]}>
        {statList.map((item) => (
          <Col xs={12} sm={8} md={6} key={item.title}>
            <Card bordered={false} className="mb-2">
              <Statistic title={item.title} value={item.value ?? 0} />
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">User đăng ký theo tháng</h3>
          <Table
            columns={columnsUser}
            dataSource={monthlyUsers}
            rowKey="month"
            size="small"
            loading={loading}
            pagination={false}
            bordered
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Check-in theo tháng</h3>
          <Table
            columns={columnsCheckin}
            dataSource={monthlyCheckins}
            rowKey="month"
            size="small"
            loading={loading}
            pagination={false}
            bordered
          />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Doanh thu theo tháng</h3>
        <div style={{ marginBottom: 16 }}>
          <span>Chọn năm: </span>
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
            {years.map(y => <Option key={y} value={y}>{y}</Option>)}
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics; 