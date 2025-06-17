import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../utils/forumUtils.js';

export default function useForumPage(initialCategoryTag, queryKeyPrefix) {
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryTag);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const { isPending, data } = useQuery({
        queryKey: [queryKeyPrefix, currentPage, keyword, selectedCategory, fromDate, toDate],
        queryFn: () =>
            getPosts({
                categoryTag: selectedCategory,
                keyword,
                page: currentPage,
                fromDate,
                toDate
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
        isPending
    };
}
