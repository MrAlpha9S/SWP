import React from 'react';
import {Checkbox, Radio, Input} from "antd";
import {
    useErrorStore,
    useTimeAfterWakingStore,
    useTimeOfDayStore,
    useTriggersStore
} from "../../../stores/store.js";
import {
    timeAfterWakingRadioOptions,
    checkboxStyle,
    timeOfDayOptions,
    smokingTriggerOptions
} from "../../../constants/constants.js";
import ErrorText from "../../ui/errorText.jsx";

const SmokingRoutine = () => {

    const {TextArea} = Input

    const {timeAfterWaking, setTimeAfterWaking} = useTimeAfterWakingStore()
    const {
        timeOfDayList,
        toggleTimeOfDay,
        customTimeOfDay,
        setCustomTimeOfDay,
        customTimeOfDayChecked,
        setCustomTimeOfDayChecked
    } = useTimeOfDayStore()
    const {
        triggers,
        toggleTrigger,
        customTrigger,
        setCustomTrigger,
        customTriggerChecked,
        setCustomTriggerChecked
    } = useTriggersStore()
    const {errors} = useErrorStore()

    function timeOfDayOnChange(value) {
        if (value === 'other') {
            setCustomTimeOfDayChecked(!customTimeOfDayChecked)
        }
        toggleTimeOfDay(value)
    }

    function triggersOnChange(value) {
        if (value === 'other') {
            setCustomTriggerChecked(!customTriggerChecked)
        }
        toggleTrigger(value)
    }

    return (
        <>
            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                4. Những yếu tố kích thích bạn hút thuốc
            </h2>

            <div className="text-left text-sm md:text-base">
                <p>
                    Việc hiểu rõ khi nào và tại sao bạn hút thuốc sẽ giúp bạn tìm ra cách tốt
                    nhất để cai. Bằng cách xác định các yếu tố kích thích, bạn có thể lên kế hoạch
                    trước,
                    thay đổi thói quen và tăng cơ hội thành công.
                </p>
            </div>

            <div className="mt-8 text-left font-bold text-base md:text-lg">
                <h3>Bạn thường hút thuốc bao lâu sau khi thức dậy?</h3>
            </div>
            <div className='my-[-30]'>
                {errors.map((error, index) => {
                    if (error.location === "timeAfterWaking") {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <div className="flex flex-col gap-2">
                <Radio.Group
                    onChange={(e) => setTimeAfterWaking(e.target.value)}
                    value={timeAfterWaking}
                    options={timeAfterWakingRadioOptions}
                    size="large"
                    style={checkboxStyle}
                />
            </div>
            <div className="mt-4 text-sm text-gray-600">
                <strong>Đã chọn:</strong>{" "}
                {timeAfterWaking}
            </div>

            <div className="mt-8 text-left font-bold text-base md:text-lg">
                <h3>Bạn thường hút thuốc vào thời điểm nào trong ngày?
                    <span className="font-normal block text-sm">(Chọn tất cả những gì phù hợp)</span>
                </h3>
            </div>
            <div className='my-[-30]'>
                {errors.map((error, index) => {
                    if (error.location === "timeOfDay") {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <div className="flex flex-col gap-2">
                {timeOfDayOptions.map((option) => (
                    <Checkbox
                        key={option.value}
                        value={option.value}
                        onChange={() => timeOfDayOnChange(option.value)}
                        checked={timeOfDayList.includes(option.value)}
                    >
                        {option.label}
                    </Checkbox>
                ))}
                {customTimeOfDayChecked &&
                    <>
                        <div className=''>
                            {errors.map((error, index) => {
                                if (error.location === "customTimeOfDay") {
                                    return (
                                        <ErrorText key={index}>{error.message}</ErrorText>
                                    )
                                }
                            })}
                        </div>
                        <TextArea
                            onChange={(e) => setCustomTimeOfDay(e.target.value)}
                            value={customTimeOfDay}
                        />
                    </>}
                <div className="mt-4 text-sm text-gray-600">
                    <strong>Đã chọn:</strong>{" "}
                    {timeOfDayList.length === 0
                        ? "Chưa chọn"
                        : timeOfDayList.join(", ")}
                </div>
            </div>

            <div className="mt-8 text-left font-bold text-base md:text-lg">
                <h3>Những điều nào dưới đây khiến bạn muốn hút thuốc?
                    <span className="font-normal block text-sm">(Chọn tất cả những gì phù hợp)</span>
                </h3>
            </div>
            <div className='my-[-30]'>
                {errors.map((error, index) => {
                    if (error.location === "triggers") {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <div className="flex flex-col gap-2">
                {smokingTriggerOptions.map((option) => (
                    <Checkbox
                        key={option.value}
                        value={option.value}
                        onChange={() => triggersOnChange(option.value)}
                        checked={triggers.includes(option.value)}
                    >
                        {option.label}
                    </Checkbox>
                ))}
                {customTriggerChecked &&
                    <>
                        <div className=''>
                            {errors.map((error, index) => {
                                if (error.location === "customTrigger") {
                                    return (
                                        <ErrorText key={index}>{error.message}</ErrorText>
                                    )
                                }
                            })}
                        </div>
                        <TextArea
                            onChange={(e) => setCustomTrigger(e.target.value)}
                            value={customTrigger}
                        />
                    </>}
                <div className="mt-4 text-sm text-gray-600">
                    <strong>Đã chọn:</strong>{" "}
                    {triggers.length === 0
                        ? "Chưa chọn"
                        : triggers.join(", ")}
                </div>
            </div>
        </>
    );
};

export default SmokingRoutine;