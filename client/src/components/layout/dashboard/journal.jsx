import React, {useEffect, useMemo, useState} from 'react';
import {Collapse, DatePicker, Timeline} from 'antd';
import {useQuery} from "@tanstack/react-query";
import {convertDDMMYYYYStrToYYYYMMDDStr, getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {getCheckInData} from "../../utils/checkInUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import {useCheckInDataStore} from "../../../stores/checkInStore.js";
import {usePlanStore} from "../../../stores/store.js";
import TimeLineEachMonth from "../../ui/timeLineEachMonth.jsx";
import CustomButton from "../../ui/CustomButton.jsx";
import dayjs from "dayjs";

const Journal = () => {
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const {allCheckInData, setAllCheckInData} = useCheckInDataStore();
    const {startDate} = usePlanStore()
    const [searchDate, setSearchDate] = useState('')



    const dropdownItems = useMemo(() => {
        let dropdownItems = [];
        const localStartDate = new Date(startDate);
        const localCurrentDate = getCurrentUTCDateTime()

        let i = 1
        while (
            localStartDate.getFullYear() < localCurrentDate.getFullYear() ||
            (localStartDate.getFullYear() === localCurrentDate.getFullYear() &&
                localStartDate.getMonth() <= localCurrentDate.getMonth())
            ) {
            let displayMonth = localStartDate.toLocaleString('vi-VN', { month: 'short' });
            const baseMonth = localStartDate.getMonth();
            const baseYear = localStartDate.getFullYear();

            let finalDay = 0;
            let finalMonth = baseMonth;
            let finalYear = baseYear;

            if (searchDate.length > 0) {
                const parsedSearchDate = new Date(searchDate);
                const parsedMonth = parsedSearchDate.getMonth();
                const parsedYear = parsedSearchDate.getFullYear();

                if (parsedMonth === baseMonth && parsedYear === baseYear) {
                    finalDay = parsedSearchDate.getDate();
                    finalMonth = parsedMonth;
                    finalYear = parsedYear;
                } else {
                    finalDay = 0;
                    finalMonth = baseMonth;
                    finalYear = baseYear;
                }
            }

            dropdownItems.push({
                key: `${i++}`,
                label: `${displayMonth} ${baseYear}`,
                children: (
                    <TimeLineEachMonth
                        day={finalDay}
                        month={finalMonth}
                        year={finalYear}
                        allCheckInData={allCheckInData}
                    />
                ),
            });

            localStartDate.setMonth(localStartDate.getMonth() + 1);
        }
        return dropdownItems;
    }, [startDate, searchDate, allCheckInData]);


    const {
        isPending: isCheckInDataPending,
        error: CheckInDataError,
        data: CheckInData,
        isFetching: isFetchingCheckInData,
    } = useQuery({
        queryKey: ['all-checkin-data'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getCheckInData(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isCheckInDataPending) {
            if (CheckInDataError && !CheckInData.success) {
                return <div>Check in data not found</div>
            } else {
                setAllCheckInData(CheckInData.data);
            }
        }
    }, [isCheckInDataPending, CheckInData]);

    useEffect(() => {

    }, [allCheckInData]);

    return <>
        <div className="flex flex-col gap-4">
            <div className='flex gap-5'>
                <DatePicker className='h-[42px] w-[40%]' onChange={(date, dateString) => {
                    setSearchDate(`${convertDDMMYYYYStrToYYYYMMDDStr(dateString)}T00:00:00Z`);
                }} format={'DD-MM-YYYY'} value={searchDate ? dayjs(searchDate) : ''} allowClear={false} placeholder='Chọn ngày để tìm kiếm'/>
                <CustomButton onClick={() => setSearchDate('')}>Xóa tìm kiếm</CustomButton>
            </div>
            <Collapse items={dropdownItems} defaultActiveKey={['1']}/>
        </div>
    </>
};

export default Journal;