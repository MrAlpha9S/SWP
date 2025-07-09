import React from 'react';
import {Tabs} from 'antd';
import PostBlog from "./postblog.jsx";

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
        children: 'Bài viết đã đăng',
    },
    {
        key: '3',
        label: 'Bài viết chờ duyệt',
        children: 'Bài viết chờ duyệt',
    },
];
const ManageBlog = () => {
    return (
        <div className='w-full h-screen'>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>
        </div>
    )
}
export default ManageBlog;