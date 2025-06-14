import React, {useEffect, useState} from 'react';
import {Timeline} from "antd";
import {FEELINGS, qnaOptions} from "../../constants/constants.js";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../utils/dateUtils.js";
import CustomButton from "./CustomButton.jsx";

const TimeLineEachMonth = ({day, month, year, allCheckInData}) => {

    const [timeLineItem, setTimeLineItem] = useState([])
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        console.log(expanded)
    }, [expanded])

    useEffect(() => {
        const timeLineItems = () => {
            console.log('allCheckInData', allCheckInData)
            const checkinData = allCheckInData.filter((data) => {
                const fetchedDate = new Date(data.logged_at);
                const fetchedDay = fetchedDate.getDate();
                const fetchedMonth = fetchedDate.getMonth();
                const fetchedYear = fetchedDate.getFullYear();

                return (
                    fetchedMonth === month &&
                    fetchedYear === year &&
                    (day === 0 || fetchedDay === day)
                );
            });


            return checkinData.map((entry) => {
                const feeling = FEELINGS.find((feel) => entry.feeling === feel.value);
                const cigsSmoked = entry.cigs_smoked;

                let cigsSmokedPhrase = '';
                if (cigsSmoked === 0) {
                    cigsSmokedPhrase = 'Tôi đã không hút điếu nào trong hôm nay';
                } else if (cigsSmoked > 0) {
                    cigsSmokedPhrase = `Tôi đã hút ${cigsSmoked} điếu thuốc`;
                } else {
                    cigsSmokedPhrase = 'missed';
                }

                const freetext = entry.free_text_content;
                const qna = entry.qna;

                const dateStrDDMMYY = convertYYYYMMDDStrToDDMMYYYYStr(entry.logged_at.split('T')[0])

                return {
                    color: cigsSmoked !== null ? 'green' : 'red',
                    children: (
                        <>
                            <div className="transition-all duration-300"
                                 style={expanded ? {} : {maxHeight: 200, overflow: 'hidden'}}>
                                <p className="text-base font-semibold text-gray-800">
                                    {dateStrDDMMYY}
                                </p>

                                {feeling && (
                                    <p className="text-sm font-medium text-gray-600">
                                        {feeling.emoji} {feeling.label}
                                    </p>
                                )}

                                <p className="text-sm italic text-gray-700">
                                    {cigsSmokedPhrase}
                                </p>

                                {(freetext || qna.length > 0) && (
                                    <p className="text-sm font-semibold text-primary-700 mt-2">Tôi đã viết:</p>
                                )}

                                {freetext && (
                                    <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                                        {freetext}
                                    </p>
                                )}

                                {qna.length > 0 && qnaOptions.map(({value, label}, index) => (
                                    <div key={index} className="mb-3 line-clamp-5">
                                        <p className="text-sm font-medium text-gray-700">{label}</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {qna[index]?.qna_answer ?? "Không có câu trả lời"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {(freetext?.length > 100 || qna.length > 0) && (
                                <CustomButton onClick={() => setExpanded(!expanded)} className="mt-1">
                                    {expanded ? 'Rút gọn' : 'Xem thêm'}
                                </CustomButton>
                            )}
                        </>
                    )
                };
            });
        };
        if (allCheckInData.length > 0) {
            setTimeLineItem(timeLineItems());
        }

    }, [allCheckInData, day, month, year])

    return <Timeline items={timeLineItem}/>;
};


export default TimeLineEachMonth;