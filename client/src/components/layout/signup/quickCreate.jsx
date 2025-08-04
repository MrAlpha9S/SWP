import React from 'react';
import {Checkbox, DatePicker, Radio} from "antd";
import {checkboxStyle, quittingMethodOptions} from "../../../constants/constants.js";
import dayjs from "dayjs";
import {convertDDMMYYYYStrToYYYYMMDDStr} from "../../utils/dateUtils.js";
import ErrorText from "../../ui/errorText.jsx";

const QuickCreate = ({setQuittingMethod, quittingMethod, from, setExpectedQuitDate, expectedQuitDate, errors, cigsReduced, setCigsReduced}) => {
    return (
        <div className='space-y-4'>
            <p className="block text-sm md:text-base text-gray-700 mb-1">Hãy chọn phương pháp:</p>
            <div className=''>
                {errors.map((error, index) => {
                    if (error.location === "quitMethod" ) {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>

            <Radio.Group
                onChange={(e) => {
                    setQuittingMethod(e.target.value)
                }}
                value={quittingMethod}
                options={quittingMethodOptions}
                size="large"
                style={checkboxStyle}
            />

            {(quittingMethod === "target-date") ? (
                <>
                    <div className='block text-sm md:text-base text-gray-700 mb-1'>
                        <h3>Hãy chọn ngày trong tương lai
                            mà {from === 'coach-user' ? 'người dùng' : 'bạn'} quyết định ngừng hút</h3>
                    </div>

                    <DatePicker minDate={dayjs().add(1, 'day')} className='h-[42px]' onChange={(date, dateString) => {
                        setExpectedQuitDate(`${convertDDMMYYYYStrToYYYYMMDDStr(dateString)}T00:00:00Z`);
                    }} format={'DD-MM-YYYY'} value={expectedQuitDate ? dayjs(expectedQuitDate) : ''}
                                allowClear={false}/>

                    <div className='my-[-30]'>
                        {errors.map((error, index) => {
                            if (error.location === "expectedQuitDate") {
                                return (
                                    <ErrorText key={index}>{error.message}</ErrorText>
                                )
                            }
                        })}
                    </div>
                </>
            ) : (
                <>
                    <label htmlFor="cigsPerInterval"
                           className="block text-sm md:text-base text-gray-700 mb-1">
                        {from === 'coach-user' ? 'Người dùng' : 'Bạn'} quyết định giảm bao nhiêu điếu
                        thuốc
                        mỗi {quittingMethod === 'gradual-daily' ? 'ngày' : 'tuần'}?
                    </label>
                    <div className=''>
                        {errors.map((error, index) => {
                            if (error.location === "cigsReduced" || error.location === "cigsReducedLarge") {
                                return (
                                    <ErrorText key={index}>{error.message}</ErrorText>
                                )
                            }
                        })}
                    </div>
                    <input
                        id="cigsPerInterval"
                        type="number"
                        value={cigsReduced}
                        onChange={(e) => setCigsReduced(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </>
            )}
        </div>
    );
};

export default QuickCreate;