import React from 'react';
import {DatePicker, Radio} from "antd";
import {useErrorStore, usePlanStore, useQuitReadinessStore} from "../../../stores/store.js";
import {checkboxStyle, readinessRadioOptions} from "../../../constants/constants.js";
import ErrorText from "../../ui/errorText.jsx";
import {
    convertDDMMYYYYStrToYYYYMMDDStr,
} from "../../utils/dateUtils.js";
import dayjs from "dayjs";

const Readiness = () => {
    const {readinessValue, setReadinessValue} = useQuitReadinessStore();
    const {errors} = useErrorStore();
    const {
        startDate,
        setStartDate,
        stoppedDate,
        setStoppedDate,
    } = usePlanStore();

    const onChangeCheckbox = (event) => {
        setReadinessValue(event.target.value);
    };

    return (
        <>
            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>
                1. Bạn đã sẵn sàng bỏ thuốc chưa?
            </h2>
            <div className="text-left text-sm md:text-base">
                <p>
                    Mỗi người có một thời điểm khác nhau để bắt đầu hành trình bỏ thuốc. Việc xác định bạn đang ở giai
                    đoạn nào sẽ giúp xây dựng một kế hoạch phù hợp và hiệu quả hơn. Bạn có thể đã sẵn sàng để bắt đầu
                    thay đổi, hoặc có thể bạn đã bỏ thuốc và đang tìm cách duy trì kết quả. Hãy lựa chọn tình trạng
                    hiện tại của bạn để chúng tôi có thể hỗ trợ bạn đúng cách, đúng lúc.
                </p>
            </div>
            <div className='my-[-20px]'>
                {errors.map((error, index) => {
                    if (error.atPage === 'readiness') {
                        return (
                            <ErrorText data-testid='readiness-error' key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <Radio.Group
                className='ready-radio'
                onChange={onChangeCheckbox}
                value={readinessValue}
                options={readinessRadioOptions}
                size="large"
                style={checkboxStyle}
            />
            {readinessValue === 'ready' && <>
                <label htmlFor="startDate" className="text-left font-bold text-base md:text-lg mb-[-56px]">
                    Hãy chọn ngày mà bạn quyết định bắt đầu hành trình cai thuốc:
                </label>

                <div className='my-[-30]'>
                    {errors.map((error, index) => {
                        if (error.location === "startDate") {
                            return (
                                <ErrorText key={index}>{error.message}</ErrorText>
                            )
                        }
                    })}
                </div>

                <DatePicker minDate={dayjs()} className='h-[42px]' onChange={(date, dateString) => {
                    setStartDate(`${convertDDMMYYYYStrToYYYYMMDDStr(dateString)}T00:00:00Z`);
                }} format={'DD-MM-YYYY'} value={startDate ? dayjs(startDate) : ''} allowClear={false}/>
            </>}

            {readinessValue === "relapse-support" &&
                <>
                    <div className="text-left text-sm md:text-base">
                        <p>
                            Việc duy trì trạng thái không hút thuốc có thể đầy thách thức, nhất là trong những lúc căng
                            thẳng,
                            mệt mỏi hoặc khi đối mặt với thói quen cũ. Việc xác định rõ ngày bạn đã ngừng hút sẽ giúp
                            bạn theo
                            dõi hành trình của mình, xây dựng động lực và nhận diện các thời điểm dễ tái nghiện. Dựa vào
                            ngày
                            bạn đã ngừng hút, chúng tôi sẽ tính toán số điếu đã bỏ, số tiền đã tiết kiệm,... từ thông
                            tin đó
                            cho bạn theo dõi để có động lực duy trì tình trạng ngừng hút hơn.
                        </p>
                    </div>
                    <form className="w-[60%] flex flex-col gap-3">
                        <div className='text-left font-bold text-base md:text-lg'>
                            <h3>Hãy chọn ngày mà bạn đã ngừng hút</h3>
                        </div>

                        <div className='my-[-30]'>
                            {errors.map((error, index) => {
                                if (error.location === "stoppedDate") {
                                    return (
                                        <ErrorText key={index}>{error.message}</ErrorText>
                                    )
                                }
                            })}
                        </div>
                        <DatePicker className='h-[42px]' onChange={(date, dateString) => {
                            setStoppedDate(`${convertDDMMYYYYStrToYYYYMMDDStr(dateString)}T00:00:00Z`);
                        }} format={'DD-MM-YYYY'} value={stoppedDate ? dayjs(stoppedDate) : ''} allowClear={false}/>

                    </form>
                </>}
        </>
    );
};

export default Readiness;