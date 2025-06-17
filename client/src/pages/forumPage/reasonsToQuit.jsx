import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import ForumLayout from '../../components/layout/forum/forumLayout.jsx';
import {getPostsByCategoryTag} from "../../components/utils/forumUtils.js";


export default function ReasonsToQuit() {
    const [posts, setPosts] = useState([]);
    const {isPending, data} = useQuery({
        queryKey: ['posts-reason-to-quit'],
        queryFn: () => getPostsByCategoryTag('reasons-to-quit'),
    });

    useEffect(() => {
        if (!isPending && data?.data) {
            setPosts(data.data);
        }
    }, [isPending, data]);

    return (
        <ForumLayout
            title="Lý do cai thuốc"
            heroImg="/reasons-to-quit.svg"
            heroDesc="Lập kế hoạch và chuyển bị để bắt đầu hành trình cai thuốc hiệu quả."
            posts={posts}
        />
    );
}
