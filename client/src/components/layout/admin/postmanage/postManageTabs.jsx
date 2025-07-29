import React from 'react';
import {Tabs} from 'antd';
import PostManagement from './PostManagement.jsx';
import IsPendingPost from '../../coachboard/manageforum/ispendingpost.jsx';

const items = [
    {
        key: '1',
        label: 'Quản lý bài viết',
        children: <PostManagement/>
    },
    {
        key: '2',
        label: 'Duyệt bài viết',
        children: <IsPendingPost/>,
    },
];
const PostManage = () => {
    return (
        <div className='w-full h-screen'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    )
}
export default PostManage;