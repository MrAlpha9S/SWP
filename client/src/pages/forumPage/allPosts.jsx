import React from 'react';
import useForumPage from '../../components/hooks/useForumPage.js';
import ForumLayout from '../../components/layout/forum/forumLayout';

export default function AllPosts() {
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
    } = useForumPage('', 'all-posts');

    return (
        <ForumLayout
            title="Cộng đồng"
            heroImg="/getting-started.svg"
            heroDesc="      Cộng đồng EzQuit luôn chào đón tất cả mọi người, dù bạn đang ở giai đoạn nào trên hành trình cai
                thuốc. Hãy khám phá những câu chuyện của người khác để tìm cảm hứng, sự động viên và động lực cho
                riêng mình.
                <br/>
                Bạn cũng có thể chia sẻ trải nghiệm của bản thân, xin lời khuyên hoặc tiếp thêm sức mạnh cho người
                khác. Đừng quên xem qua nội quy cộng đồng để giữ cho nơi đây luôn tích cực và an toàn cho tất cả mọi
                người nhé!"
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