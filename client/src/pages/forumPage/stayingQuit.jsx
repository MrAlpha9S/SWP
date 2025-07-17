// pages/StayingQuit.jsx
import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

export default function StayingQuit() {
    const {
        posts,
        total,
        currentPage,
        setCurrentPage,
        keyword,
        setKeyword,
        selectedCategory,
        setSelectedCategory,
        fromDate,
        setFromDate,
        toDate,
        setToDate
    } = useForumPage('staying-quit', 'posts-staying-quit');

    return (
        <PageFadeWrapper>
            <ForumLayout
                title="Duy trì cai thuốc"
                heroImg="/staying-quit.svg"
                heroDesc="Lập kế hoạch và chuẩn bị để bắt đầu hành trình cai thuốc hiệu quả."
                posts={posts}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={total}
                keyword={keyword}
                setKeyword={setKeyword}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
            />
        </PageFadeWrapper>

    );
}
