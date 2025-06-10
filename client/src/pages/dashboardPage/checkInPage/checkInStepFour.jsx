import React, {useEffect, useState} from 'react';
import {Typography, Divider} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FrownFilled,
    FrownOutlined,
    MehOutlined,
    SmileOutlined,
    SmileFilled
} from '@ant-design/icons';
import {useCheckInDataStore, useStepCheckInStore} from '../../../stores/checkInStore';
import CustomButton from "../../../components/ui/CustomButton.jsx";
import {qnaOptions, quitStrategies} from "../../../constants/constants.js";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "../../../main.jsx"
import {useAuth0} from "@auth0/auth0-react";
import {postCheckIn} from "../../../components/utils/checkInUtils.js";
import {useNavigate} from "react-router-dom";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../../components/utils/dateUtils.js";

const {Title, Text} = Typography;

const CheckInStepFour = () => {
    const {
        checkInDate,
        feel,
        checkedQuitItems,
        freeText,
        qna,
        isFreeText,
        cigsSmoked,
        isStepOneOnYes,
        isJournalSelected,
        setAlreadyCheckedIn
    } = useCheckInDataStore();
    const {handleBackToStepOne} = useStepCheckInStore();
    const [journalRender, setJournalRender] = useState('')
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const navigate = useNavigate();


    let feelLabel = ''
    switch (feel) {
        case 'terrible':
            feelLabel = 'tệ';
            break;
        case 'bad':
            feelLabel = 'buồn';
            break;
        case 'okay':
            feelLabel = 'ổn';
            break;
        case 'good':
            feelLabel = 'tốt';
            break;
        case 'great':
            feelLabel = 'tuyệt vời';
            break;
    }

    useEffect(() => {
        if (isJournalSelected) {
            if (isFreeText) {
                setJournalRender('freetext')
            } else {
                setJournalRender('qna')
            }
        }
    }, [isFreeText, isJournalSelected])

    const postCheckin = useMutation({
        mutationFn: () => {
            postCheckIn(user, getAccessTokenSilently, isAuthenticated, checkInDate, feel, checkedQuitItems, freeText, qna, isFreeText, cigsSmoked, isStepOneOnYes, isJournalSelected);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['dataset']});
            navigate('/dashboard');
        },
    })

    const handleSave = () => {
        postCheckin.mutate()
        //setAlreadyCheckedIn(true)
    }


    return (
        <div className="max-w-xl mx-auto rounded-md p-6 shadow-md bg-white">

            {/* Congratulatory Message */}
            <Title level={4} className="text-center text-primary-700">
                {isStepOneOnYes ? 'Chúc mừng bạn đã không hút thuốc! Hãy cố gắng check-in mỗi ngày để giữ vững tiến trình của mình.' : 'Đừng từ bỏ, bạn có thể làm được!'}
            </Title>

            {/* Check-in Summary */}
            <div className="mt-6">
                <Title level={5}>Tóm tắt Check-in</Title>
                <Divider className="my-2"/>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <Text>Ngày check-in: {convertYYYYMMDDStrToDDMMYYYYStr(checkInDate.split('T')[0])}</Text>
                    <a onClick={handleBackToStepOne} className="text-primary-700 font-medium cursor-pointer">Sửa</a>
                </div>

                {isStepOneOnYes && <div className="flex items-start gap-2 mb-2">
                    <CheckCircleOutlined className="text-blue-500 mt-1"/>
                    <Text className='text-left'>Tôi đã không hút thuốc vì: {checkedQuitItems.map((item, index) => {
                        const option = quitStrategies.find(opt => opt.value === item);
                        return option ? <span key={index}>{option.label}, </span> : '';
                    })}</Text>
                </div>}

                {!isStepOneOnYes && (
                    <div className="flex items-start gap-2 mb-2">
                        <CloseCircleOutlined className="text-red-500 mt-1"/>
                        <Text>Tôi đã hút: {cigsSmoked} điếu thuốc</Text>
                    </div>
                )}

                <div className="flex items-start gap-2">
                    {feel === 'great' ? (
                        <SmileFilled className="text-green-500 mt-1"/>
                    ) : feel === 'good' ? (
                        <SmileOutlined className="text-yellow-500 mt-1"/>
                    ) : feel === 'okay' ? (
                        <MehOutlined className="text-yellow-500 mt-1"/>
                    ) : feel === 'sad' ? (
                        <FrownOutlined className="text-yellow-500 mt-1"/>
                    ) : (
                        <FrownFilled className="text-red-500 mt-1"/>
                    )}
                    <Text>
                        Tôi cảm thấy {feelLabel} hôm nay!
                    </Text>
                </div>
                {journalRender === 'freetext' &&
                    <>
                        <Divider className="my-2"/>
                        <div>
                            <Title level={5}>Nhật ký của bạn</Title>
                            <p>{freeText}</p>
                        </div>
                    </>
                }
                {journalRender === 'qna' &&
                    <>
                        <Divider className="my-2"/>
                        <div>
                            <Title level={5}>Nhật ký của bạn</Title>
                            <div className="text-left space-y-6">
                                {qnaOptions.map(({value, label}) => (
                                    <div key={value}>
                                        <p className="text-xs md:text-sm font-bold mb-4">{label}</p>
                                        <Text>{qna[value]}</Text>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </>
                }
            </div>
            <div className="flex justify-center w-full mt-6"><CustomButton
                onClick={() => handleSave()}>Lưu</CustomButton></div>
        </div>
    );
};

export default CheckInStepFour;
