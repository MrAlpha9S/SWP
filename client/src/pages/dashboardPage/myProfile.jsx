import React, {useEffect, useState} from 'react';
import CustomButton from "../../components/ui/CustomButton.jsx";
import {Result} from "antd";

import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

import Title from "antd/es/skeleton/Title.js";
import Paragraph from "antd/es/skeleton/Paragraph.js";
import {getUserProfile, syncProfileToStores} from "../../components/utils/profileUtils.js"
import Summary from "../../components/layout/signup/summary.jsx";

const MyProfile = () => {

    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [fetchStatus, setFetchStatus] = useState(null);
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const syncOnLoad = async () => {
            if (!isAuthenticated || !user) return;
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
            if (result?.data) {
                await syncProfileToStores(result.data);
                setFetchStatus(true);
            }
        };
        syncOnLoad();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return (
        <div className='min-h-[calc(100vh-80px-409px)] flex items-center'>
            {!fetchStatus &&
                <div className='flex flex-col md:flex-row items-center justify-center gap-5 w-full p-14'>
                    <div className='w-[60%] flex flex-col items-center md:items-start gap-10'>
                        <h2 className='md:text-4xl lg:text-5xl font-bold'>
                            Không tìm thấy thông tin kế hoạch của bạn
                        </h2>
                        <CustomButton onClick={() => navigate('/onboarding')} type='primary'>Tạo kế hoạch</CustomButton>
                    </div>
                    <Result
                        status={404}
                        title={
                            <Title
                                level={1}
                                className="!text-gray-800 !mb-4 text-2xl md:text-3xl lg:text-4xl font-bold"
                            >
                                hey
                            </Title>
                        }
                        subTitle={
                            <Paragraph className="!text-gray-600 !text-lg md:!text-xl !mb-8 leading-relaxed">
                                yo
                            </Paragraph>
                        }
                        className="!p-0"
                    />
                </div>}
            <div className='flex flex-col h-full w-full bg-white gap-14 p-14'><Summary/></div>
        </div>
    );
};

export default withAuthenticationRequired(MyProfile);