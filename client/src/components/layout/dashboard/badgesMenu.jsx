import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import {Popover} from "antd";

const achievedBadges = [
    { label: '7 Ngày Không Hút Thuốc', icon: '/7-days-smoke-free.svg', description: '7 ngày không khói thuốc.', },
    { label: 'Bắt đầu nào!', icon: '/streak-starter.svg', description: 'Hoàn thành check-in đầu tiên.' },
    { label: 'Thành Viên Mới', icon: '/badge-support-3.png', description: 'Tham gia EzQuit.' },
];

const lockedBadges = [
    {
        label: '1 Năm Cai Thuốc',
        icon: '/1-year-quit.svg',
        description: '1 năm không hút thuốc – một cột mốc tuyệt vời trong hành trình cai thuốc.',
    },
    {
        label: '1 Năm Liên Tiếp',
        icon: '/1-year-streak.svg',
        description: 'Duy trì chuỗi 1 năm liên tục không hút thuốc.',
    },
    {
        label: '10 Ngày Liên Tiếp',
        icon: '/10-day-streak.svg',
        description: 'Duy trì 10 ngày liên tiếp không hút thuốc.',
    },
    {
        label: '100 Ngày Liên Tiếp',
        icon: '/100-day-streak.svg',
        description: '100 ngày kiên trì không bỏ cuộc.',
    },
    {
        label: '14 Ngày Không Hút Thuốc',
        icon: '/14-days-smoke-free.svg',
        description: '2 tuần không hút thuốc',
    },
    {
        label: '180 Ngày Không Hút Thuốc',
        icon: '/180-days-smoke-free.svg',
        description: 'Nửa năm sạch khói thuốc.',
    },
    {
        label: '30 Ngày Không Hút Thuốc',
        icon: '/30-days-smoke-free.svg',
        description: 'Một tháng không hút thuốc – tuyệt vời!',
    },
    {
        label: '5 Ngày Liên Tiếp',
        icon: '/goal-hitter.svg',
        description: '5 ngày đầu tiên là bước khởi đầu quan trọng.',
    },
    {
        label: '50 Ngày Liên Tiếp',
        icon: '/50-day-streak.svg',
        description: '50 ngày liên tiếp không hút thuốc.',
    },
    {
        label: '90 Ngày Không Hút Thuốc',
        icon: '/90-days-smoke-free.svg',
        description: '3 tháng không hút thuốc – bạn đã vượt qua những giai đoạn khó khăn nhất.',
    },
    {
        label: 'Nhà Cổ Vũ Nhiệt Tình',
        icon: '/cheer-champion.svg',
        description: 'Thích 100 bình luận hoặc bài viết.',
    },
    {
        label: 'Bậc Thầy Cộng Đồng',
        icon: '/community-guru.svg',
        description: 'Tạo 100 bài viết hoặc bình luận trong cộng đồng.',
    },
    {
        label: 'Người Tử Tế',
        icon: '/badge-support-3.png',
        description: 'Thích 50 bình luận hoặc bài viết.',
    },
    {
        label: 'Phiên Bản Mới',
        icon: '/new-me.svg',
        description: 'Tạo bài viết hoặc bình luận đầu tiên của bạn trong cộng đồng.',
    },
    {
        label: 'Người Tiết Kiệm Thông Minh',
        icon: '/streak-starter.svg',
        description: 'Hoàn thành mục tiêu tiết kiệm đầu tiên của bạn.',
    },
    {
        label: 'Người Kết Nối',
        icon: '/social-butterfly.svg',
        description: 'Tạo 25 bài viết hoặc bình luận trong cộng đồng.',
    },
    {
        label: 'Người Kể Chuyện',
        icon: '/story-teller.svg',
        description: 'Tạo 50 bài viết hoặc bình luận trong cộng đồng.',
    },
    {
        label: 'Người Chào Đón Nồng Nhiệt',
        icon: '/warm-welcomer.svg',
        description: 'Thích 10 bình luận hoặc bài viết.',
    },
];

const Badge = ({ label, icon, locked = false, description = '' }) => {
    const badgeContent = (
        <div className="flex flex-col items-center space-y-2 text-center">
            <div className="relative">
                {locked && <LockOutlined className="absolute top-0 left-0 text-gray-400 text-sm" />}
                <img
                    src={icon || '/placeholder.svg'}
                    alt={label}
                    className={`w-16 h-16 ${locked ? 'opacity-30' : ''}`}
                />
            </div>
            <p className={`text-sm font-medium ${locked ? 'text-gray-400' : 'text-primary-800'}`}>{label}</p>
        </div>
    );

    return <Popover content={description} title={label} placement="top">
            {badgeContent}
        </Popover>


};

const BadgesMenu = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
            <section className="flex flex-col gap-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Đã đạt được</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {achievedBadges.map((badge) => (
                        <Badge key={badge.label} label={badge.label} icon={badge.icon} description={badge.description}/>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Huy hiệu bị khóa</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {lockedBadges.map((badge) => (
                        <Badge key={badge.label} label={badge.label} icon={badge.icon} locked description={badge.description} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BadgesMenu;