import React from 'react';
import {Radio} from "antd";
import {useErrorStore, useQuitReadinessStore} from "../../../stores/store.js";
import {checkboxStyle, readinessRadioOptions} from "../../../constants/constants.js";
import ErrorText from "../../ui/errorText.jsx";

const Readiness = () => {
    const readinessValue = useQuitReadinessStore((state) => state.readinessValue);
    const setReadinessValue = useQuitReadinessStore((state) => state.setReadinessValue);
    const {errors} = useErrorStore();

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
            <div className='my-[-30px]'>
                {errors.map((error, index) => {
                    if (error.atPage === 'readiness') {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <Radio.Group
                onChange={onChangeCheckbox}
                value={readinessValue}
                options={readinessRadioOptions}
                size="large"
                style={checkboxStyle}
            />
            <div>
                Đã chọn: {readinessValue}
            </div>
        </>
    );
};

export default Readiness;