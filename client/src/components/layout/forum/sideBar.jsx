import React from 'react';
import {Checkbox, Collapse, DatePicker, Divider, Input} from "antd";
import {
    AppstoreOutlined,
    BookOutlined,
    CompassOutlined, EditOutlined,
    FlagOutlined,
    MessageOutlined, ProfileOutlined,
    SearchOutlined, StarOutlined, UserOutlined
} from "@ant-design/icons";

const {RangePicker} = DatePicker;

const SidebarLinks = [
    {icon: <MessageOutlined/>, label: 'Tất cả bài viết'},
    {icon: <BookOutlined/>, label: 'Chia sẻ trải nghiệm'},
    {icon: <CompassOutlined/>, label: 'Bắt đầu hành trình'},
    {icon: <FlagOutlined/>, label: 'Duy trì cai thuốc'},
    {icon: <AppstoreOutlined/>, label: 'Mẹo và lời khuyên'},
    {icon: <ProfileOutlined/>, label: 'Lý do bỏ thuốc'},
    {icon: <EditOutlined/>, label: 'Hướng dẫn cộng đồng'},
    {icon: <UserOutlined/>, label: 'Bài viết của tôi'},
    {icon: <StarOutlined/>, label: 'Yêu thích của tôi'},
];

const filters = [
    {
        key: '1',
        label: 'Filter by category',
        children: <Checkbox defaultChecked>Quit experiences</Checkbox>,
    },
    {
        key: '2',
        label: 'Filter by date',
        children: (
            <>
                <p className="text-sm mb-1">Find posts made within a certain date range</p>
                <RangePicker className="w-full"/>
            </>
        ),
    },
];

const SideBar = () => {
    return (
        <div className="space-y-4">
            <Input
                placeholder="Tìm kiếm từ khóa hoặc người dùng"
                prefix={<SearchOutlined/>}
                className="w-full"
            />

            <Divider className="my-2"/>

            <Collapse items={filters} defaultActiveKey={['0']}/>

            <div className="space-y-6">
                <button
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded-md">
                    Đăng bài
                </button>

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Đi đến mục</h4>
                    <ul className="space-y-2">
                        {SidebarLinks.map((item, idx) => (
                            <li key={idx}
                                className="flex items-center gap-2 text-gray-700 hover:text-primary-700 cursor-pointer">
                                {item.icon}
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;