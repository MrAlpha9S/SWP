import {useAuth0} from "@auth0/auth0-react"
import {DownOutlined} from '@ant-design/icons';
import {Dropdown, Space} from 'antd';

const items = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        disabled: true,
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item (disabled)
            </a>
        ),
        disabled: true,
    },
    {
        key: '4',
        danger: true,
        label: (
            <a href={`https://${import.meta.env.VITE_AUTH0_DOMAIN}/v2/logout?returnTo=http://localhost:5173&client_id=${import.meta.env.VITE_AUTH0_CLIENT_ID}`}>
                Đăng xuất
            </a>
        ),
    },
];

const Profile = () => {
    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (

            <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <div className='flex justify-center items-center'>
                            <img className='rounded-full size-14' src={user.picture} alt='avatar' />
                        </div>
                        <DownOutlined className='size-5'/>
                    </Space>
                </a>
            </Dropdown>
        )
    );
};

export default Profile;