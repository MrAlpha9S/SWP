import {UsergroupAddOutlined, DollarOutlined, FileTextOutlined, ClockCircleOutlined} from '@ant-design/icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
    BarChart,
    Bar, ComposedChart
} from 'recharts';
import {Card, Select, Skeleton} from 'antd';
import {RiUserCommunityLine} from "react-icons/ri";
import {MdOutlineReportGmailerrorred} from "react-icons/md";
import {useQuery} from "@tanstack/react-query";
import {useAuth0} from "@auth0/auth0-react";
import {getUserCommissionDataset} from "../../utils/coachUtils.js";
import React, {useEffect} from "react";
import {getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {useCoachInfoStore, useCurrentStepDashboard} from "../../../stores/store.js";

export default function CoachOverview({stats, isDataPending}) {
    const [month, setMonth] = React.useState(`${getCurrentUTCDateTime().getUTCMonth() + 1}`);
    const [year, setYear] = React.useState(`${getCurrentUTCDateTime().getUTCFullYear()}`);
    const {coachInfo} = useCoachInfoStore()
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0()
    const [userCommissionData, setUserCommissionData] = React.useState([]);
    const [listOfMonths, setListOfMonths] = React.useState([]);
    const [listOfYears, setListOfYears] = React.useState([]);
    const [displayMonthSelect, setDisplayMonthSelect] = React.useState(true);
    const [filterMode, setFilterMode] = React.useState("monthNYear");
    const {setCurrentStepDashboard} = useCurrentStepDashboard()

    const {isPending, data} = useQuery({
        queryKey: ['user-commission-dataset', month, year],
        queryFn: async () => {
            return await getUserCommissionDataset(user, getAccessTokenSilently, isAuthenticated, month, year, coachInfo?.coach?.commission_rate)
        }
    })

    useEffect(() => {
        if (!isPending) {
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

    return (
        <div className="bg-[#d5fdf3] rounded-md p-6 space-y-8">
            <h2 className="text-lg font-semibold text-center">Tổng quan huấn luyện viên</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton loading={isPending} active>
                    <StatCard icon={<UsergroupAddOutlined />} onClick={() => setCurrentStepDashboard('coach-user')} value={stats?.subscribedUserCount} label="Người dùng đã đăng ký" />
                </Skeleton>
                <Skeleton loading={isPending} active>
                    <StatCard icon={<DollarOutlined />} value={`${(stats?.totalCommission)?.toLocaleString()} VNĐ`} label="Tổng hoa hồng" />
                </Skeleton>
                <Skeleton loading={isPending} active>
                    <StatCard icon={<FileTextOutlined />} onClick={() => setCurrentStepDashboard('post-blog')} value={stats?.approvedBlogPostCount} label="Bài blog đã đăng" />
                </Skeleton>
                <Skeleton loading={isPending} active>
                    <StatCard icon={<ClockCircleOutlined />} onClick={() => setCurrentStepDashboard('post-blog')} value={stats?.pendingBlogPostCount} label="Bài blog chờ duyệt" />
                </Skeleton>
                <Skeleton loading={isPending} active>
                    <StatCard icon={<RiUserCommunityLine />} onClick={() => setCurrentStepDashboard('forum-manage')} value={stats?.pendingSocialPostCount} label="Bài viết cộng đồng chờ duyệt" />
                </Skeleton>
                <Skeleton loading={isPending} active>
                    <StatCard icon={<MdOutlineReportGmailerrorred />} onClick={() => setCurrentStepDashboard('forum-manage')} value={stats?.reportCount} label="Báo cáo bài viết cộng đồng chờ duyệt" />
                </Skeleton>
            </div>


            {/* Chart */}
            {isDataPending ? (
                <Skeleton active className="!w-full !h-80 rounded-md"/>
            ) : (
                <div className="w-full h-80 bg-white rounded-md p-4 shadow">
                    <h3 className="text-md font-semibold text-center mb-4">Biểu đồ người đăng ký & hoa hồng</h3>
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
                                label={{value: 'Số người dùng', angle: -90, position: 'insideLeft'}}
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
                                name="Người dùng"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="commission"
                                stroke="#82ca9d"
                                dot={{r: 4}}
                                name="Hoa hồng (VNĐ)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>

                </div>)}
        </div>
    );
}

function StatCard({icon, value, label, onClick}) {
    return (
        <Card
            bordered={false}
            className="bg-[#baf2e4] text-center shadow-md"
            bodyStyle={{padding: 20}}
            hoverable
            onClick={onClick}
        >
            <div className="text-2xl mb-2 flex justify-center">{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-700">{label}</p>
        </Card>
    );
}

