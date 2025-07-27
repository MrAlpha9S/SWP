import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../utils/forumUtils.js';

import { useAuth0 } from "@auth0/auth0-react";

export default function useForumPage(initialCategoryTag, queryKeyPrefix, auth0_id) {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryTag);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const { isPending, data } = useQuery({
        queryKey: [queryKeyPrefix, currentPage, keyword, selectedCategory, fromDate, toDate, auth0_id],
        queryFn: () =>
            getPosts({
                categoryTag: selectedCategory,
                keyword,
                page: currentPage,
                fromDate,
                toDate,
                auth0_id,
                currentUserId: user?.sub,
            }),
    });

    useEffect(() => {
        if (!isPending && data?.data) {
            setPosts(data.data.records || []);
            setTotal(data.data.total || 0);
        }
    }, [isPending, data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, selectedCategory, fromDate, toDate]);

    return {
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
        isPending,
    };
}
