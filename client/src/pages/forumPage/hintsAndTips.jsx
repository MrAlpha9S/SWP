import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';

export default function HintsAndTips() {
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
    } = useForumPage('hints-and-tips', 'posts-hints-and-tips');

    return (
        <ForumLayout
            title="Mẹo và lời khuyên"
            heroImg="/hints-and-tips.svg"
            heroDesc="Chia sẻ mẹo để vượt qua cơn thèm thuốc, giảm stress, và hoạt động thay thế"
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
    );
}
