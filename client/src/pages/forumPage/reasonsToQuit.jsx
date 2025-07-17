import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

export default function ReasonsToQuit() {
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
    } = useForumPage('reasons-to-quit', 'posts-reasons-to-quit');

    return (
        <PageFadeWrapper>
            <ForumLayout
                title="Lý do cai thuốc"
                heroImg="/reasons-to-quit-2.svg"
                heroDesc="Tác động tích cực đến sức khỏe, tài chính và gia đình của bạn khi bỏ thuốc."
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
