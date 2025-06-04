import React from 'react';
import {Radio} from "antd";
import {useErrorStore, useQuitReadinessStore} from "../../../stores/store.js";
import {checkboxStyle, readinessRadioOptions} from "../../../constants/constants.js";
import ErrorText from "../../ui/errorText.jsx";

const Readiness = () => {
    const {readinessValue, setReadinessValue} = useQuitReadinessStore();

    const {errors} = useErrorStore();

    const onChangeCheckbox = (event) => {
        setReadinessValue(event.target.value);
    };

    return (
        <>
            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>
                1. Bạn đã sẵn sàng bỏ thuốc chưa?
            </h2>
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