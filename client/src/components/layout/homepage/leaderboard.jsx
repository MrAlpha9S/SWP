import React from 'react';
import { Tabs, Avatar, Skeleton } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../../utils/userUtils.js";
import { Crown, Trophy, Medal, Calendar, DollarSign, Award, Star } from 'lucide-react';

const { TabPane } = Tabs;

const getRankIcon = (index) => {
    switch (index) {
        case 0:
            return <Crown className="w-6 h-6 text-yellow-500" />;
        case 1:
            return <Trophy className="w-6 h-6 text-gray-400" />;
        case 2:
            return <Medal className="w-6 h-6 text-amber-600" />;
        default:
            return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{index + 1}</span>;
    }
};

const getRankStyle = (index) => {
    switch (index) {
        case 0:
            return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg';
        case 1:
            return 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 shadow-md';
        case 2:
            return 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-md';
        default:
            return 'bg-white border border-gray-200 hover:shadow-md transition-shadow';
    }
};

const getTabIcon = (key) => {
    switch (key) {
        case 'days':
            return <Calendar className="w-4 h-4 mr-2" />;
        case 'money':
            return <DollarSign className="w-4 h-4 mr-2" />;
        case 'achievements':
            return <Award className="w-4 h-4 mr-2" />;
        default:
            return null;
    }
};

const LeaderboardCard = ({ user, index, type }) => {
    const getValue = () => {
        switch (type) {
            case 'days':
                return `${user.days_without_smoking} ngày`;
            case 'money':
                return `${user.money_saved.toLocaleString()} VNĐ`;
            case 'achievements':
                return `${user.achievement_count} thành tựu`;
            default:
                return '';
        }
    };

    const getValueColor = () => {
        switch (index) {
            case 0:
                return 'text-yellow-700';
            case 1:
                return 'text-gray-700';
            case 2:
                return 'text-amber-700';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className={`rounded-xl p-4 mb-3 transition-all duration-200 hover:scale-[1.02] ${getRankStyle(index)}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {getRankIcon(index)}
                    <Avatar
                        size={index < 3 ? 48 : 40}
                        src={user.avatar || undefined}
                        className={index < 3 ? 'border-2 border-white shadow-md' : ''}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <h3 className={`font-semibold ${index < 3 ? 'text-lg' : 'text-base'} text-gray-900`}>
                            {user.username}
                        </h3>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`font-bold ${index < 3 ? 'text-xl' : 'text-lg'} ${getValueColor()}`}>
                        {getValue()}
                    </div>
                    {index < 3 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Hạng {index + 1}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LeaderBoard = () => {
    const { isPending, data } = useQuery({
        queryFn: async () => {
            return await getLeaderboard()
        }
    });

    const customTabBar = (props, DefaultTabBar) => (
        <DefaultTabBar {...props} className="custom-tabs">
            {props.panes.map((pane) => (
                <div key={pane.key} className="flex items-center">
                    {getTabIcon(pane.key)}
                    {pane.props.tab}
                </div>
            ))}
        </DefaultTabBar>
    );

    return (
        <div className='w-full bg-gradient-to-br from-blue-50 via-white to-green-50'>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Bảng Xếp Hạng
                        </h2>
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                    <p className="text-gray-600 text-lg">
                        Chúc mừng những người chiến thắng thuốc lá! 🎉
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <Tabs
                        defaultActiveKey="days"
                        centered
                        size="large"
                        className="custom-leaderboard-tabs"
                        tabBarStyle={{
                            marginBottom: '2rem',
                            borderBottom: '2px solid #f0f0f0'
                        }}
                    >
                        <TabPane
                            tab={
                                <span className="flex items-center text-lg font-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  Số ngày không hút thuốc
                </span>
                            }
                            key="days"
                        >
                            {isPending ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} avatar active paragraph={{ rows: 1 }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.data.daysWithoutSmoking.map((user, index) => (
                                        <LeaderboardCard
                                            key={`${user.username}-${index}`}
                                            user={user}
                                            index={index}
                                            type="days"
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center text-lg font-medium">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Số tiền tiết kiệm được
                </span>
                            }
                            key="money"
                        >
                            {isPending ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} avatar active paragraph={{ rows: 1 }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.data.moneySaved.map((user, index) => (
                                        <LeaderboardCard
                                            key={`${user.username}-${index}`}
                                            user={user}
                                            index={index}
                                            type="money"
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center text-lg font-medium">
                  <Award className="w-5 h-5 mr-2" />
                  Số thành tựu
                </span>
                            }
                            key="achievements"
                        >
                            {isPending ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} avatar active paragraph={{ rows: 1 }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.data.achievedBadges.map((user, index) => (
                                        <LeaderboardCard
                                            key={`${user.username}-${index}`}
                                            user={user}
                                            index={index}
                                            type="achievements"
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Tiếp tục cố gắng để leo lên bảng xếp hạng! 💪
                    </p>
                </div>
            </div>

            <style jsx>{`
                .custom-leaderboard-tabs .ant-tabs-tab {
                    padding: 12px 24px;
                    border-radius: 8px;
                    margin: 0 8px;
                    transition: all 0.3s ease;
                }

                .custom-leaderboard-tabs .ant-tabs-tab:hover {
                    background-color: #f8fafc;
                }

            `}</style>
        </div>
    );
};

export default LeaderBoard;