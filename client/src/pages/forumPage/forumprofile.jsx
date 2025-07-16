import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';

export default function ForumProfile() {
    const { auth0_id } = useParams();
    console.log(auth0_id)
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
        setToDate,
    } = useForumPage('', 'forum-profile', auth0_id);

    if (posts.length > 0) {
        return (
            <ForumLayout
                title={posts[0].username}
                heroImg={posts[0].avatar}
                heroDesc=""
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
}