import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

export default function QuitExperiences() {
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
    } = useForumPage('quit-experiences', 'posts-quit-experiences');

    return (
        <PageFadeWrapper>
            <ForumLayout
                title="Chia sẻ kinh nghiệm"
                heroImg="/quit-experiences.svg"
                heroDesc="Chia sẻ hành trình cai thuốc của bạn - từ thử thách đến những chiến thắng"
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