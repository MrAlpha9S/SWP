import React, {useEffect} from 'react';
import {formatDate, getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {milestones} from '../../../constants/constants.js'
import {List, Progress} from "antd";


const HealthStatistics = ({achievementProgress, checkInDataset}) => {
    const [shouldRender, setShouldRender] = React.useState(false);
    const [timeDiff, setTimeDiff] = React.useState(0);
    const [timeDiffObj, setTimeDiffObj] = React.useState(null);

    useEffect(() => {
        if (checkInDataset && achievementProgress) {
            console.log(checkInDataset)

            let streakStartDate = null;

            if (checkInDataset[checkInDataset.length - 1]?.cigs !== 0) {
                setTimeDiff(0);
                return;
            }

            for (let i = checkInDataset.length - 1; i >= 0; i--) {
                const entry = checkInDataset[i];

                if (entry.cigs === 0) {
                    streakStartDate = entry.date;
                } else {
                    break;
                }
            }

            if (streakStartDate) {
                const timeDiff = getCurrentUTCDateTime() - new Date(streakStartDate);
                console.log('Streak started:', streakStartDate);
                setTimeDiff(timeDiff);
            }
        }
    }, [achievementProgress, checkInDataset]);

    useEffect(() => {
        if (timeDiff > 0) {
            const obj = formatDate(timeDiff);
            setTimeDiffObj(obj);
        }
    }, [timeDiff]);

    useEffect(() => {
        if (checkInDataset && achievementProgress) {
            setShouldRender(true);
        }
    }, [achievementProgress, checkInDataset]);

    if (!shouldRender) return <div className='loader'></div>;

    return (
        <div className="w-full mx-auto space-y-6">
            <p><strong>Bạn đã bỏ thuốc được: {timeDiffObj?.days ? timeDiffObj?.days : '0'} ngày {timeDiffObj?.hours ? timeDiffObj?.hours : '0'} giờ {timeDiffObj?.minutes ? timeDiffObj?.minutes : '0'} phút</strong></p>
            <List
                header={<p className="font-semibold text-lg">Các mốc cải thiện sức khỏe của bạn</p>}
                dataSource={milestones}
                renderItem={(milestone) => {
                    const percent = Math.min((timeDiff / (milestone.hours * 60 * 60 * 1000)) * 100, 100);

                    return (
                        <List.Item>
                            <div className="w-full">
                                <p className="font-semibold mb-1">{milestone.label}</p>
                                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                                <Progress percent={Math.round(percent)} status={percent === 100 ? 'success' : 'active'} />
                            </div>
                        </List.Item>
                    );
                }}
            />

        </div>
    );

};

export default HealthStatistics;