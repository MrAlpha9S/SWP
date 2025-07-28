import React from 'react';
import {Tabs} from 'antd';
import BlogManagement from './BlogManagement.jsx';
import IsPendingBlog from './isPendingBlog.jsx';

const items = [
    {
        key: '1',
        label: 'Quản lý bài Blog',
        children: <BlogManagement/>
    },
    {
        key: '2',
        label: 'Duyệt bài Blog',
        children: <IsPendingBlog/>,
    },
];
const BlogManage = () => {
    return (
        <div className='w-full h-screen'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    )
}
export default BlogManage;