import React from 'react';
import {Tabs} from 'antd';
import IsPendingPost from './ispendingpost'

const onChange = key => {
    console.log(key);
};
const items = [
    {
        key: '1',
        label: 'Phê duyệt bài viết người dùng',
        children: <IsPendingPost/>,
    },
    {
        key: '2',
        label: 'Báo cáo',
        children: '',
    },
];
const ManageForum = () => {
    return (
        <div className='w-full h-screen'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    )
}
export default ManageForum;