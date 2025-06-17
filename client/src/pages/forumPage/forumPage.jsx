import React, {useEffect, useState} from 'react';
import {Card, Divider, Input} from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    BookOutlined,
    FlagOutlined,
    AppstoreOutlined,
    EditOutlined,
    MessageOutlined,
    ProfileOutlined,
    StarOutlined,
    CompassOutlined
} from '@ant-design/icons';
import Hero from "../../components/layout/forum/hero.jsx";
import {useQuery} from "@tanstack/react-query";
import {getForumCategoryMetadata} from "../../components/utils/forumUtils.js";
import { useNavigate } from "react-router-dom";

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

export default function ForumPage() {

    const [categoryMetadata, setCategoryMetadata] = React.useState([]);
    const navigate = useNavigate();

    const {
        isPending: isforumCategoryMetadataPending,
        data: forumCategoryMetadata,
    } = useQuery({
        queryKey: ['forum-category-metadata'],
        queryFn: async () => {
            return await getForumCategoryMetadata()
        },
    })

    useEffect(() => {
        if (!isforumCategoryMetadataPending) {
            setCategoryMetadata(forumCategoryMetadata.data)
        }
    }, [forumCategoryMetadata, isforumCategoryMetadataPending])

    const [heroHeight, setHeroHeight] = useState(472);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 20) {
                setHeroHeight(30);
            } else if (scrollY < 10) {
                setHeroHeight(472);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="w-full h-full">
            <Hero title='Cộng đồng' img='/community.png' heroHeight={heroHeight}>
                Cộng đồng QuitEz luôn chào đón tất cả mọi người, dù bạn đang ở giai đoạn nào trên hành trình cai
                thuốc. Hãy khám phá những câu chuyện của người khác để tìm cảm hứng, sự động viên và động lực cho
                riêng mình.
                <br/>
                Bạn cũng có thể chia sẻ trải nghiệm của bản thân, xin lời khuyên hoặc tiếp thêm sức mạnh cho người
                khác. Đừng quên xem qua nội quy cộng đồng để giữ cho nơi đây luôn tích cực và an toàn cho tất cả mọi
                người nhé!
            </Hero>
            <div className="max-w-7xl bg-primary-50 mx-auto px-14 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Section */}
                <div className="md:col-span-3 space-y-6">
                    {!isforumCategoryMetadataPending && categoryMetadata.length > 0 && categoryMetadata.map((section, idx) => (
                        <Card key={idx} hoverable className="bg-primary-100 border-0" onClick={() => navigate(`/forum/${section.category_tag}`)}>
                            <div className="flex items-center gap-6 bg-primary-100 py-6 h-[170px]">
                            <img src={section.img_path} alt={section.category_name} className="size-56 object-contain"/>
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-lg font-bold text-primary-900">{section.category_name}</h3>
                                    <p className="text-gray-700">{section.description}</p>
                                    <Divider orientation="horizontal"/>
                                    <div className="flex gap-10 text-sm text-purple-900 font-semibold">
                                        <div>
                                            Thảo luận:
                                            <p>{section.post_count.toLocaleString()}</p>
                                        </div>

                                        <div>
                                            Bình luận:
                                            <p>{section.comment_count.toLocaleString()}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <button
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded-md">
                        Đăng bài
                    </button>

                    <Input
                        placeholder="Tìm kiếm từ khóa hoặc người dùng"
                        prefix={<SearchOutlined/>}
                        className="w-full"
                    />

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
        </div>

    );
}
