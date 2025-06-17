import React from 'react';
import { Tabs, Table, Avatar } from 'antd';

const { TabPane } = Tabs;

// Sample data
const leaderboardData = {
    cigs: [
        { key: 1, name: 'Alice', avatar: '', value: 350 },
        { key: 2, name: 'Bob', avatar: '', value: 300 },
        { key: 3, name: 'Charlie', avatar: '', value: 250 },
    ],
    money: [
        { key: 1, name: 'Alice', avatar: '', value: 900000 },
        { key: 2, name: 'Bob', avatar: '', value: 750000 },
        { key: 3, name: 'Charlie', avatar: '', value: 620000 },
    ],
    days: [
        { key: 1, name: 'Alice', avatar: '', value: 120 },
        { key: 2, name: 'Bob', avatar: '', value: 110 },
        { key: 3, name: 'Charlie', avatar: '', value: 100 },
    ]
};

// Shared columns
const getColumns = (title) => [
    {
        title: 'Tên người dùng',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
            <div className="flex items-center gap-2">
                <Avatar src={record.avatar || undefined}>{text[0]}</Avatar>
                <span>{text}</span>
            </div>
        ),
    },
    {
        title: title,
        dataIndex: 'value',
        key: 'value',
        render: (val) => title === 'Money Saved' ? `${val.toLocaleString()}₫` : val
    },
];

const LeaderBoard = () => {
    return (
        <div className='w-full bg-white'>
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 ">
                    Bảng xếp hạng
                </h2>
                <Tabs defaultActiveKey="cigs" centered>
                    <TabPane tab="Số điếu đã bỏ" key="cigs">
                        <Table
                            columns={getColumns('Số điếu đã bỏ')}
                            dataSource={leaderboardData.cigs}
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="Số tiền tiết kiệm được" key="money">
                        <Table
                            columns={getColumns('Số tiền tiết kiệm được')}
                            dataSource={leaderboardData.money}
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="Số ngày không hút thuốc" key="days">
                        <Table
                            columns={getColumns('Số ngày không hút thuốc')}
                            dataSource={leaderboardData.days}
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </div>

    );
};

export default LeaderBoard;
