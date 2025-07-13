import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Table, notification } from 'antd';
import { getStatistics } from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';

const Statistics = () => {
  const [stats, setStats] = useState({});
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [monthlyCheckins, setMonthlyCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getStatistics(token);
      setStats(data.stats || {});
      setMonthlyUsers(data.monthlyUsers || []);
      setMonthlyCheckins(data.monthlyCheckins || []);
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

  const statList = [
    { title: 'Tổng User', value: stats.totalUsers },
    { title: 'Tổng Coach', value: stats.totalCoachs },
    { title: 'Bài viết', value: stats.totalPosts },
    { title: 'Bình luận', value: stats.totalComments },
    { title: 'Blog', value: stats.totalBlogs },
    { title: 'Chủ đề', value: stats.totalTopics },
    { title: 'Subscription', value: stats.totalSubscriptions },
    { title: 'Check-in', value: stats.totalCheckins },
  ];

  const columnsUser = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Số user đăng ký', dataIndex: 'count', key: 'count' },
  ];
  const columnsCheckin = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Số check-in', dataIndex: 'count', key: 'count' },
  ];

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
    </div>
  );
};

export default Statistics; 