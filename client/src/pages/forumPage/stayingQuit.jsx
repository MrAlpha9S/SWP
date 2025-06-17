import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import ForumLayout from '../../components/layout/forum/forumLayout.jsx';
import {getPostsByCategoryTag} from "../../components/utils/forumUtils.js";


export default function StayingQuit() {
    const [posts, setPosts] = useState([]);
    const {isPending, data} = useQuery({
        queryKey: ['posts-staying-quit'],
        queryFn: () => getPostsByCategoryTag('staying-quit'),
    });

    useEffect(() => {
        if (!isPending && data?.data) {
            setPosts(data.data);
        }
    }, [isPending, data]);

    return (
        <ForumLayout
            title="Chia sẻ kinh nghiệm"
            heroImg="/staying-quit.svg"
            heroDesc="Lập kế hoạch và chuyển bị để bắt đầu hành trình cai thuốc hiệu quả."
            posts={posts}
        />
    );
}
