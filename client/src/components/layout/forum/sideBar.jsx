import React from 'react';
import {Checkbox, Collapse, DatePicker, Divider, Input, Radio} from "antd";
import {useNavigate} from "react-router-dom";
import {
    AppstoreOutlined,
    BookOutlined,
    CompassOutlined, EditOutlined,
    FlagOutlined,
    MessageOutlined, ProfileOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {convertUTCStringToLocalDate} from "../../utils/dateUtils.js";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;

const categoryOptions = [
    {label: 'Chia sẻ trải nghiệm', value: 'quit-experiences'},
    {label: 'Bắt đầu hành trình', value: 'getting-started'},
    {label: 'Duy trì cai thuốc', value: 'staying-quit'},
    {label: 'Mẹo và lời khuyên', value: 'tips-and-advice'},
    {label: 'Lý do bỏ thuốc', value: 'reasons-to-quit'}
];

const SidebarLinks = [
    {icon: <MessageOutlined/>, label: 'Tất cả bài viết', dest: '/forum/all-posts'},
    {icon: <BookOutlined/>, label: 'Chia sẻ trải nghiệm', dest: '/forum/quit-experiences'},
    {icon: <CompassOutlined/>, label: 'Bắt đầu hành trình', dest: '/forum/getting-started'},
    {icon: <FlagOutlined/>, label: 'Duy trì cai thuốc', dest: '/forum/staying-quit'},
    {icon: <AppstoreOutlined/>, label: 'Mẹo và lời khuyên', dest: '/forum/hints-and-tips'},
    {icon: <ProfileOutlined/>, label: 'Lý do bỏ thuốc', dest: '/forum/reasons-to-quit'},
    {icon: <EditOutlined/>, label: 'Hướng dẫn cộng đồng', dest: '/forum/all-posts'},
];

const SideBar = ({
                     keyword, setKeyword, selectedCategory,
                     setSelectedCategory,
                     fromDate,
                     setFromDate,
                     toDate,
                     setToDate
                 }) => {
    const navigate = useNavigate();

    const filters = [
        {
            key: '1',
            label: 'Lọc theo danh mục',
            children: <>
                <Radio.Group
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={categoryOptions}
                />
            </>,
        },
        {
            key: '2',
            label: 'Lọc theo ngày',
            children: (
                <>
                    <p className="text-sm mb-1">Lọc các bài viết trong một khoảng thời gian</p>
                    <RangePicker className="w-full" onChange={(dateStr) => {
                        if (!dateStr || (!dateStr[0] && !dateStr[1])) {
                            setFromDate('');
                            setToDate('');
                            return
                        }
                        const fromDate = convertUTCStringToLocalDate(dateStr[0]).toISOString()
                        const toDate = convertUTCStringToLocalDate(dateStr[1]).toISOString()
                        setFromDate(fromDate)
                        setToDate(toDate)
                    }} format='DD-MM-YYYY' value={[
                        fromDate ? dayjs(fromDate) : null,
                        toDate ? dayjs(toDate) : null,
                    ]}/>
                </>
            ),
        },
    ];

    return (
            <div className="space-y-4">
                <Input
                    placeholder="Tìm kiếm từ khóa hoặc người dùng"
                    prefix={<SearchOutlined/>}
                    className="w-full"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <Divider className="my-2"/>

                <button
                    onClick={() => {
                        setSelectedCategory('');
                        setToDate('');
                        setKeyword('');
                        setFromDate('');
                    }}
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded-md"
                >
                    Xóa bộ lọc
                </button>

                <Collapse items={filters} defaultActiveKey={['1', '2']}/>

                <div className="space-y-6">
                    <button
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded-md">
                        Đăng bài
                    </button>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Đi đến mục</h4>
                        <ul className="space-y-2">
                            {SidebarLinks.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <li
                                        onClick={() => navigate(item.dest)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-primary-700 cursor-pointer"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </li>
                                    <Divider/>
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
    )
};

export default SideBar;