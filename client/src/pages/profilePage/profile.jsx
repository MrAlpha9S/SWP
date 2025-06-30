import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, updateUserController } from "../../components/utils/userUtils.js";
import { Form, Input, Button, Avatar, Modal, message, Spin, Typography } from "antd";
import { UserOutlined, MailOutlined, UserSwitchOutlined, CalendarOutlined, CameraOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";

// Notify component
const Notify = {
    success: (msg) => message.success(msg),
    error: (msg) => message.error(msg),
    info: (msg) => message.info(msg),
};

const { Title, Text } = Typography;

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently, isLoading: authLoading } = useAuth0();
    const queryClient = useQueryClient();

    const [avatarModal, setAvatarModal] = useState(false);
    const [avatarInput, setAvatarInput] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm] = Form.useForm();
    const [form] = Form.useForm();

    // Fetch user info
    const {
        data,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["profileInfo"],
        queryFn: async () => {
            const res = await getUserInfo(user, getAccessTokenSilently, isAuthenticated);
            return Array.isArray(res.data) ? res.data[0] : res.data;
        },
        enabled: isAuthenticated && !!user,
    });

    // Update user info
    const mutation = useMutation({
        mutationFn: async (values) => {
            await updateUserController(user, getAccessTokenSilently, values);
        },
        onSuccess: () => {
            Notify.success("Cập nhật thành công!");
            queryClient.invalidateQueries(["profileInfo"]);
        },
        onError: () => {
            Notify.error("Cập nhật thất bại!");
        },
    });

    // Set form values when data loaded
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                username: data.username,
                email: data.email,
            });
            setAvatarPreview(data.avatar || "");
        }
    }, [data, form]);

    if (authLoading || isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Text type="danger">Không thể tải thông tin người dùng.</Text>
            </div>
        );
    }

    const isSocial = data?.is_social;

    // Handle avatar update
    const handleAvatarOk = () => {
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(avatarInput.trim())) {
            Notify.error("Link ảnh không hợp lệ! (phải là http(s)://...jpg/png/jpeg/gif)");
            return;
        }
        mutation.mutate({
            username: data.username,
            email: data.email,
            avatar: avatarInput.trim(),
        });
        setAvatarPreview(avatarInput.trim());
        setAvatarModal(false);
        setAvatarInput("");
    };

    // Handle avatar remove
    const handleAvatarRemove = () => {
        mutation.mutate({
            username: data.username,
            email: data.email,
            avatar: "",
        });
        setAvatarPreview("");
    };

    // Handle form submit
    const onFinish = (values) => {
        mutation.mutate({
            username: values.username,
            email: values.email,
            avatar: avatarPreview,
        });
    };

    const handlePasswordChange = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            Notify.error("Mật khẩu mới không khớp!");
            return;
        }
        if (values.newPassword.length < 6) {
            Notify.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }
        try {
            await updateUserController(user, getAccessTokenSilently, {
                username: data.username,
                email: data.email,
                avatar: avatarPreview,
                password: values.newPassword,
            });
            Notify.success("Đổi mật khẩu thành công!");
            setShowPasswordModal(false);
            passwordForm.resetFields();
        } catch (err) {
            Notify.error("Đổi mật khẩu thất bại!");
        }
    };

    return (
        <div className="flex flex-col items-center bg-[#e0f7fa] min-h-screen py-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <Title level={2} className="text-center mb-6 text-primary-700">Hồ sơ cá nhân</Title>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <Avatar
                            size={112}
                            src={avatarPreview || undefined}
                            icon={<UserOutlined />}
                            className="border-4 border-primary-400 shadow"
                        />
                        <Button
                            shape="circle"
                            icon={<CameraOutlined />}
                            className="absolute bottom-2 right-2 bg-primary-500 text-white border-none shadow hover:bg-primary-600"
                            onClick={() => setAvatarModal(true)}
                        />
                    </div>
                    <Button
                        type="link"
                        danger
                        className="mt-2"
                        onClick={handleAvatarRemove}
                        disabled={!avatarPreview}
                    >
                        Xóa avatar
                    </Button>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        username: data.username,
                        email: data.email,
                    }}
                >
                    <Form.Item
                        label={<span className="flex items-center gap-2"><UserOutlined className="text-primary-400" /> Tên người dùng</span>}
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
                    >
                        <Input
                            disabled={false}
                            placeholder="Tên người dùng"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="flex items-center gap-2"><MailOutlined className="text-primary-400" /> Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input
                            disabled={isSocial}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="flex items-center gap-2"><UserSwitchOutlined className="text-primary-400" /> Vai trò</span>}
                    >
                        <Input value={data.role} disabled />
                    </Form.Item>
                    <Form.Item
                        label={<span className="flex items-center gap-2"><CalendarOutlined className="text-primary-400" /> Ngày tạo</span>}
                    >
                        <Input value={data.created_at} disabled />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow"
                                icon={<EditOutlined />}
                                disabled={
                                    mutation.isPending ||
                                    (
                                        form.getFieldValue("username") === data.username &&
                                        form.getFieldValue("email") === data.email &&
                                        avatarPreview === (data.avatar || "")
                                    )
                                }
                                loading={mutation.isPending}
                            >
                                Cập nhật
                            </Button>
                        )}
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    icon={<LockOutlined />}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => setShowPasswordModal(true)}
                >
                    Đổi mật khẩu
                </Button>
            </div>
            {/* Modal cập nhật avatar */}
            <Modal
                title="Cập nhật avatar từ link"
                open={avatarModal}
                onOk={handleAvatarOk}
                onCancel={() => setAvatarModal(false)}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Input
                    placeholder="Dán link ảnh (http...)"
                    value={avatarInput}
                    onChange={e => setAvatarInput(e.target.value)}
                    suffix={<CameraOutlined />}
                />
            </Modal>
            {/* Modal đổi mật khẩu */}
            <Modal
                title="Đổi mật khẩu"
                open={showPasswordModal}
                onCancel={() => setShowPasswordModal(false)}
                footer={null}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                >
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                    >
                        <Input.Password placeholder="Mật khẩu cũ" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                    >
                        <Input.Password placeholder="Mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;