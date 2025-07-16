// components/forum/ForumLayout.jsx
import React, { useEffect, useState } from 'react';
import Hero from "./Hero.jsx"; // or pass this in via props
import PostCard from './PostCard.jsx';
import Sidebar from './Sidebar.jsx';
import { Input, Divider, Pagination } from 'antd';

export default function ForumLayout({
    title,
    heroImg,
    heroDesc,
    posts,
    currentPage,
    setCurrentPage,
    totalItems,
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
}) {
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
        <div className="bg-white ">
            <Hero title={title} img={heroImg} heroHeight={heroHeight}>
                {heroDesc}
            </Hero>
            <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-4 w-[95%]">
                    <p className="text-sm text-gray-600 mb-2">{totalItems} bài viết</p>
                    {posts.map(post => <PostCard
                        key={post.id}
                        {...post} 
                        />)}
                    <div className='w-full flex justify-center'><Pagination
                        defaultPageSize={4}
                        onChange={(page) => {
                            setCurrentPage(page)
                        }}
                        current={currentPage}
                        total={totalItems}
                    /></div>
                </div>
                <div className="space-y-4">
                    <Sidebar
                        keyword={keyword}
                        setKeyword={setKeyword}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setToDate={setToDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        fromDate={fromDate}
                    />
                </div>
            </div>
        </div>
    );
}
