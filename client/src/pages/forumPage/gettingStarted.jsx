import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

export default function GettingStarted() {
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
    } = useForumPage('getting-started', 'posts-getting-started');

    return (
        <PageFadeWrapper>
            <ForumLayout
                title="Bắt đầu hành trình"
                heroImg="/getting-started.svg"
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
