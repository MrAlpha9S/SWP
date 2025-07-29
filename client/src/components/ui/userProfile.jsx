import { useAuth0 } from "@auth0/auth0-react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "../utils/userUtils.js";
import {useEffect, useState} from "react";
import {getBackendUrl} from "../utils/getBackendURL.js";

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const [userInfo, setUserInfo] = useState();
    const navigate = useNavigate();

    const {
        data: userIn4,
        isPending: isUserIn4Pending,
    } = useQuery({
        queryKey: ['userIn4'],
        queryFn: async () => {
            return await getUserInfo(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isUserIn4Pending) {
            setUserInfo(userIn4.data)
        }
    }, [isUserIn4Pending, userIn4]);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    const handleProfileClick = () => {
        navigate("/my-profile");
    };

    const handleDashboardClick = () => {
        navigate("/dashboard");
    }

    const handleUserInfoClick = () => {
        navigate("/profile");
    }

    const handleSettingsClick = () => {
        navigate("/settings");
    }

    const handleAdminClick = () => {
        navigate("/admin");
    }

    let items = userInfo?.role === 'Admin' ? [
        {
            key: "1",
            label: <span onClick={handleAdminClick}>Quản trị</span>,
        }
    ] : [
        {
            key: "1",
            label: <span onClick={handleDashboardClick}>Bảng điều khiển</span>,
        },
        {
            key: "2",
            label: <span onClick={handleProfileClick}>Thông tin & kế hoạch</span>,
        },
        {
            key: "3",
            label: <span onClick={handleUserInfoClick}>Thông tin cá nhân</span>,
        },
        {
            key: "4",
            label: <span onClick={handleSettingsClick}>Cài đặt thông báo</span>,
        },
    ];

    items.push({
        key: "5",
        danger: true,
        label: (
            <a
                href={`https://${import.meta.env.VITE_AUTH0_DOMAIN}/v2/logout?returnTo=${getBackendUrl()}&client_id=${import.meta.env.VITE_AUTH0_CLIENT_ID}`}
            >
                Đăng xuất
            </a>
        ),
    });

    return (
        isAuthenticated && (
            <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <div className="flex justify-center items-center">
                            <img
                                className="rounded-full size-14"
                                src={userInfo?.avatar}
                                alt="avatar"
                            />
                        </div>
                        <DownOutlined className="size-5" />
                    </Space>
                </a>
            </Dropdown>
        )
    );
};

export default Profile;
