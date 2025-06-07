import { useAuth0 } from "@auth0/auth0-react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate(); // fix here: remove destructuring

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    const handleProfileClick = () => {
        navigate("/my-profile");
    };

    const handleDashboardClick = () => {
        navigate("/dashboard");
    }

    const items = [
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
            label: (
                <a
                    target="_self"
                    rel="noopener noreferrer"
                    href="https://www.luohanacademy.com"
                >
                    Thông tin cá nhân
                </a>
            ),
        },
        {
            key: "4",
            danger: true,
            label: (
                <a
                    href={`https://${import.meta.env.VITE_AUTH0_DOMAIN}/v2/logout?returnTo=http://localhost:5173&client_id=${import.meta.env.VITE_AUTH0_CLIENT_ID}`}
                >
                    Đăng xuất
                </a>
            ),
        },
    ];

    return (
        isAuthenticated && (
            <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <div className="flex justify-center items-center">
                            <img
                                className="rounded-full size-14"
                                src={user.picture}
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
