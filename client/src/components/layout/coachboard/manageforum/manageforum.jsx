import React from 'react';
import {Tabs} from 'antd';
import IsPendingPost from './ispendingpost'
import Report from './report'

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
        children: <Report/>,
    },
];
const ManageForum = () => {
    return (
        <div className='w-full h-full'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    )
}
export default ManageForum;