// components/forum/ForumLayout.jsx
import React, {useEffect, useState} from 'react';
import Hero from "./Hero.jsx"; // or pass this in via props
import PostCard from './PostCard.jsx';
import Sidebar from './Sidebar.jsx';
import {Input, Divider} from 'antd';
import {SearchOutlined} from '@ant-design/icons';

export default function ForumLayout({title, heroImg, heroDesc, posts}) {
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
        <div className="bg-white">
            <Hero title={title} img={heroImg} heroHeight={heroHeight}>
                {heroDesc}
            </Hero>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-4">
                    <p className="text-sm text-gray-600 mb-2">{posts.length} bài viết</p>
                    {posts.map(post => <PostCard key={post.id} {...post} />)}
                </div>
                <div className="space-y-4">
                    <Input placeholder="Tìm kiếm từ khóa hoặc người dùng" prefix={<SearchOutlined/>} className="w-full"/>
                    <Divider className="my-2"/>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
