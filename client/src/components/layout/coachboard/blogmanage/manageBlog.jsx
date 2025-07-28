import React from 'react';
import {Tabs} from 'antd';
import PostBlog from "./postblog.jsx";
import PostedBlog from './postedblog.jsx'
import IsPendingBlog from './ispendingblog.jsx';

const onChange = key => {
    console.log(key);
};
const items = [
    {
        key: '1',
        label: 'Đăng bài viết',
        children: <PostBlog/>
    },
    {
        key: '2',
        label: 'Bài viết đã đăng',
        children: <PostedBlog/>,
    },
    {
        key: '3',
        label: 'Bài viết chờ duyệt',
        children: <IsPendingBlog/>,
    },
];
const ManageBlog = () => {
    return (
        <div className='w-full h-screen'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    )
}
export default ManageBlog;