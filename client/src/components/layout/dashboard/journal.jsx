import React, {useEffect, useMemo, useState} from 'react';
import {Collapse, DatePicker} from 'antd';
import {useQuery} from "@tanstack/react-query";
import {convertDDMMYYYYStrToYYYYMMDDStr, getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import {getCheckInData} from "../../utils/checkInUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import {useCheckInDataStore} from "../../../stores/checkInStore.js";
import {usePlanStore, useUserCreationDate} from "../../../stores/store.js";
import TimeLineEachMonth from "./timeLineEachMonth.jsx";
import CustomButton from "../../ui/CustomButton.jsx";
import dayjs from "dayjs";
import {getUserCreationDate} from "../../utils/userUtils.js";

const Journal = () => {
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const {allCheckInData, setAllCheckInData} = useCheckInDataStore();
    const {startDate} = usePlanStore()
    const [searchDate, setSearchDate] = useState('')
    const {setUserCreationDate} = useUserCreationDate();


    const {
        isPending: isCheckInDataPending,
        error: CheckInDataError,
        data: CheckInData,
    } = useQuery({
        queryKey: ['all-checkin-data'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getCheckInData(user, getAccessTokenSilently, isAuthenticated, null, 'journal');
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

    const {
        isPending: isUserCreationDatePending,
        data: userCreationDate,
    } = useQuery({
        queryKey: ['user-creation-date'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getUserCreationDate(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isUserCreationDatePending) {
            setUserCreationDate(userCreationDate.data)
        }
    }, [isUserCreationDatePending])


    const dropdownItems = useMemo(() => {
        let dropdownItems = [];
        const startDate = new Date(userCreationDate?.data);
        const localCurrentDate = getCurrentUTCDateTime()

        let i = 1
        while (
            startDate.getUTCFullYear() < localCurrentDate.getUTCFullYear() ||
            (startDate.getUTCFullYear() === localCurrentDate.getUTCFullYear() &&
                startDate.getUTCMonth() <= localCurrentDate.getUTCMonth())
            ) {
            let displayMonth = startDate.toLocaleString('vi-VN', {month: 'short'});
            const baseMonth = startDate.getUTCMonth();
            const baseYear = startDate.getUTCFullYear();

            let finalDay = 0;
            let finalMonth = baseMonth;
            let finalYear = baseYear;

            if (searchDate.length > 0) {
                const parsedSearchDate = new Date(searchDate);
                const parsedMonth = parsedSearchDate.getUTCMonth();
                const parsedYear = parsedSearchDate.getUTCFullYear();

                if (parsedMonth === baseMonth && parsedYear === baseYear) {
                    finalDay = parsedSearchDate.getUTCDate();
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
                        userCreationDate={userCreationDate?.data}
                    />
                ),
            });

            startDate.setMonth(startDate.getUTCMonth() + 1);
        }
        return dropdownItems;
    }, [startDate, searchDate, allCheckInData, userCreationDate]);

    useEffect(() => {
        if (dropdownItems.length > 1) {
            dropdownItems.sort((a, b) => b.key - a.key)
        }
    }, [dropdownItems, dropdownItems.length]);


    return <>
        <div className="flex flex-col gap-4">
            <div className='flex gap-5'>
                <DatePicker className='h-[42px] w-[40%]' onChange={(date, dateString) => {
                    setSearchDate(`${convertDDMMYYYYStrToYYYYMMDDStr(dateString)}T00:00:00Z`);
                }} format={'DD-MM-YYYY'} value={searchDate ? dayjs(searchDate) : ''} allowClear={false}
                            placeholder='Chọn ngày để tìm kiếm'/>
                <CustomButton onClick={() => setSearchDate('')}>Xóa tìm kiếm</CustomButton>
            </div>
            <Collapse items={dropdownItems} defaultActiveKey={[`${dropdownItems.length}`]}/>
        </div>
    </>
};

export default Journal;