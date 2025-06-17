import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import ForumLayout from '../../components/layout/forum/forumLayout.jsx';
import {getPostsByCategoryTag} from "../../components/utils/forumUtils.js";


export default function HintsAndTips() {
    const [posts, setPosts] = useState([]);
    const {isPending, data} = useQuery({
        queryKey: ['posts-hints-and-tips'],
        queryFn: () => getPostsByCategoryTag('hints-and-tips')
    });

    useEffect(() => {
        if (!isPending && data?.data) {
            setPosts(data.data);
        }
    }, [isPending, data]);

    return (
        <ForumLayout
            title="Mẹo và lời khuyên"
            heroImg="/hints-and-tips.svg"
            heroDesc="Lập kế hoạch và chuyển bị để bắt đầu hành trình cai thuốc hiệu quả."
            posts={posts}
        />
    );
}
