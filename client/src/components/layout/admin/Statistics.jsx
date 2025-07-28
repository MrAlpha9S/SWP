import React, { useEffect, useState } from 'react';
import {Card, Statistic, Row, Col, Table, notification, Skeleton} from 'antd';
import {getRevenueDataset, getStatistics} from '../../utils/adminUtils';
import { useAuth0 } from '@auth0/auth0-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart, Bar
} from 'recharts';
import { Select } from 'antd';
import {getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {useQuery} from "@tanstack/react-query";
const { Option } = Select;

const Statistics = () => {
  const [stats, setStats] = useState({});
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [monthlyCheckins, setMonthlyCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [month, setMonth] = React.useState(`${getCurrentUTCDateTime().getUTCMonth() + 1}`);
  const [year, setYear] = React.useState(`${getCurrentUTCDateTime().getUTCFullYear()}`);
  const [userCommissionData, setUserCommissionData] = React.useState([]);
  const [listOfMonths, setListOfMonths] = React.useState([]);
  const [listOfYears, setListOfYears] = React.useState([]);
  const [displayMonthSelect, setDisplayMonthSelect] = React.useState(true);
  const [filterMode, setFilterMode] = React.useState("monthNYear");

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

  const {isPending, data} = useQuery({
    queryKey: ['revenue-dataset', month, year],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return await getRevenueDataset(token, month, year);
    },
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (!isPending) {
      console.log(data.data)
      setUserCommissionData(data?.data.chartData)
      setListOfMonths(data?.data.arrayOfMonths)
      setListOfYears(data?.data.arrayOfYears)
    }
  }, [isPending, data])

  const handleFilterChange = (e) => {
    setFilterMode(e);
    if (e === 'monthNYear') {
      setMonth(`${getCurrentUTCDateTime().getUTCMonth() + 1}`)
      setDisplayMonthSelect(true);
    } else {
      setMonth('');
      setDisplayMonthSelect(false);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e)
  }

  const handleYearChange = (e) => {
    setYear(e)
  }


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
        <h3 className="font-semibold mb-2">Biểu đồ số đăng ký & doanh thu</h3>
        {isPending ? (
            <Skeleton active className="!w-full !h-80 rounded-md"/>
        ) : (
            <div className="w-full h-80 bg-white rounded-md p-4 shadow">
              <div className='flex items-center'>
                <p>Lọc theo:</p>
                <Select
                    value={filterMode}
                    variant="borderless"
                    style={{width: 90}}
                    onChange={handleFilterChange}
                    options={[
                      {value: 'monthNYear', label: 'Tháng'},
                      {value: 'year', label: 'Năm'},
                    ]}
                />
                {displayMonthSelect && <div className='flex items-center'>
                  <p>Chọn tháng:</p>
                  <Select
                      value={`${month}`}
                      variant="borderless"
                      style={{width: 110}}
                      onChange={handleMonthChange}
                      options={(listOfMonths || []).map((m) => ({
                        value: m.toString(),
                        label: `Tháng ${m}`
                      }))}
                  />
                </div>}
                <div className='flex items-center'>
                  <p>Chọn năm:</p>
                  <Select
                      value={`${year}`}
                      variant="borderless"
                      style={{width: 90}}
                      onChange={handleYearChange}
                      options={(listOfYears || []).map((y) => ({
                        value: y.toString(),
                        label: y.toString()
                      }))}
                  />
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={userCommissionData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date"/>
                  <YAxis
                      yAxisId="left"
                      allowDecimals={false}
                      label={{value: 'Số gói đăng ký', angle: -90, position: 'insideLeft'}}
                  />
                  <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 'auto']}
                      label={{value: 'VNĐ', angle: -90, position: 'insideRight'}}
                  />
                  <Tooltip
                      formatter={(value, name) =>
                          name.includes('VNĐ') ? `${value.toLocaleString()} VNĐ` : value
                      }
                  />
                  <Legend/>
                  <Bar
                      yAxisId="left"
                      dataKey="users"
                      fill="#134e4a"
                      name="Số gói đăng ký"
                  />
                  <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="commission"
                      stroke="#82ca9d"
                      dot={{r: 4}}
                      name="Doanh thu (VNĐ)"
                  />
                </ComposedChart>
              </ResponsiveContainer>

            </div>)}
      </div>
    </div>
  );
};

export default Statistics; 