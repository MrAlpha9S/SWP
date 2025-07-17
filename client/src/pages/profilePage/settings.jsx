import React, {useEffect, useState} from 'react';
import Hero from "../../components/layout/profilepage/hero.jsx";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";
import {useNotificationAllowedStore, useUserInfoStore} from "../../stores/store.js";
import CustomButton from "../../components/ui/CustomButton.jsx";
import {generateToken, messaging} from "../../../notifications/firebase.js";
import {onMessage} from "firebase/messaging";
import {useMutation} from "@tanstack/react-query";
import {updateUserTimesForPush, updateUserToken} from "../../components/utils/userUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Card, Col, Row, TimePicker, Form} from "antd";
import {DeleteOutlined, PlusOutlined, ClockCircleOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import {useNotificationManager} from "../../components/hooks/useNotificationManager.jsx";
import QuoteCarousel from "../../components/ui/quotesCarousel.jsx";

const Settings = () => {
    const {userInfo} = useUserInfoStore();
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [timeList, setTimeList] = useState([]);
    const [newTime, setNewTime] = useState(null);
    const [form] = Form.useForm();
    const { openNotification } = useNotificationManager();
    const {setNotificationAllowed} = useNotificationAllowedStore();

    useEffect(() => {
        if (userInfo?.time_to_send_push) {
            const times = userInfo.time_to_send_push.split("-");
            setTimeList(times);
        }
    }, [userInfo]);

    const updateFCMMutation = useMutation({
        mutationFn: async ({token, user, getAccessTokenSilently, isAuthenticated}) => {
            return await updateUserToken(user, getAccessTokenSilently, isAuthenticated, token);
        },
    });

    const updateTimesMutation = useMutation({
        mutationFn: async ({user, getAccessTokenSilently, isAuthenticated, times}) => {
            return await updateUserTimesForPush(user, getAccessTokenSilently, isAuthenticated, times);
        },
        onSuccess: () => {
            openNotification('success', {
                message: 'Lưu thành công',
            })
        },
        onError: () => {
            openNotification('failed', {
                message: 'Lưu thất bại'
            })
        }
    });


    const handlePermission = async () => {
        const token = await generateToken();
        if (token) {
            setNotificationAllowed(true)
            updateFCMMutation.mutate({user, getAccessTokenSilently, isAuthenticated, token});

        } else {
            console.warn('🔕 User denied or blocked notifications');
        }
    };

    const addTime = () => {
        if (newTime) {
            const formatted = newTime.format('HH:mm');
            if (!timeList.includes(formatted)) {
                setTimeList(prev => [...prev, formatted]);
                setNewTime(null);
            }
        }
    };

    const removeTime = (timeToRemove) => {
        setTimeList(prev => prev.filter(time => time !== timeToRemove));
    };

    const onFinish = () => {
        const joined = timeList.join("-");
        console.log("🕒 Times saved:", joined);

        updateTimesMutation.mutate({
            user,
            getAccessTokenSilently,
            isAuthenticated,
            times: joined,
        });
    };


    return (
        <PageFadeWrapper>
            <div className="bg-[#e0f7fa] min-h-screen flex flex-col">
                <Hero
                    title="Cài đặt thông báo"
                    heroHeight={120}
                    username={userInfo?.username || ""}
                    role={userInfo?.role}
                />
                <div className="flex flex-1 justify-center items-start py-8">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-2">
                        <div className="flex flex-col items-center mb-6 space-y-4">
                            <p>Chúng tôi sẽ gửi các câu nói truyền cảm hứng và nhắc nhở bạn lý do bỏ thuốc vào các thời điểm bạn chọn dưới đây.</p>
                            {Notification.permission !== 'granted' ? (
                                <div>
                                    <p>Bạn chưa cho phép thông báo</p>
                                    <CustomButton onClick={handlePermission}>Cho phép thông báo</CustomButton>
                                </div>
                            ) : (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    className="w-full space-y-6"
                                >
                                    <div className="flex gap-4 items-center">
                                        <TimePicker
                                            format="HH:mm"
                                            value={newTime}
                                            onChange={(value) => setNewTime(value)}
                                            className="w-full"
                                        />
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={addTime}
                                            className="bg-teal-600 hover:bg-teal-700"
                                        >
                                            Thêm thời gian
                                        </Button>
                                    </div>

                                    <div className="w-full mt-4 space-y-4">
                                        {timeList.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <ClockCircleOutlined className="text-4xl mb-2" />
                                                <p>Chưa có thời gian nào được thiết lập.</p>
                                            </div>
                                        ) : (
                                            timeList.map((time, index) => (
                                                <Card key={index} className="flex justify-between items-center">
                                                    <span className="font-medium text-lg text-gray-800">
                                                        Thời điểm: {time}
                                                    </span>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeTime(time)}
                                                    />
                                                </Card>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <Button htmlType="submit" type="primary" className="bg-teal-600 hover:bg-teal-700">
                                            Lưu thời gian
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <QuoteCarousel/>
        </PageFadeWrapper>
    );
};

export default Settings;
