import { Checkbox } from "antd";
import React from "react";
import {useErrorStore, useReasonStore} from "../../../stores/store.js";
import {reasonListOptions} from "../../../constants/constants.js";
import ErrorText from "../../ui/errorText.jsx";

const Reason = () => {
    const reasonList = useReasonStore((state) => state.reasonList);
    const toggleReason = useReasonStore((state) => state.toggleReason);
    const {errors} = useErrorStore()

    const onChangeCheckbox = (e) => {
        const value = e.target.value;
        toggleReason(value)
    };

    return (
        <>
            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                2. Động lực bỏ thuốc của bạn
            </h2>
            <div className="text-left text-sm md:text-base">
                <p>
                    Có rất nhiều lý do tốt để bỏ thuốc lá, nhưng những lý do quan trọng
                    nhất đối với bạn sẽ giúp bạn duy trì động lực. Việc chọn ra 3 lý do
                    hàng đầu sẽ giúp bạn dễ dàng tập trung và nhắc nhở bạn tại sao bạn lại
                    quyết định thay đổi này. Hãy chọn những lý do mà bạn thấy phù hợp – bạn
                    có thể quay lại và cập nhật chúng bất cứ lúc nào.
                </p>
            </div>
            <div className="text-left font-bold text-base md:text-lg">
                <h3>Hãy chọn 3 lý do quan trọng nhất để bỏ thuốc</h3>
            </div>
            <div className='my-[-30px]'>
                {errors.map((error, index) => {
                    if (error.atPage === 'reason') {
                        return (
                            <ErrorText key={index}>{error.message}</ErrorText>
                        )
                    }
                })}
            </div>
            <div className="flex flex-col gap-3">
                {reasonListOptions.map((reason) => (
                    <Checkbox
                        key={reason.value}
                        value={reason.value}
                        onChange={onChangeCheckbox}
                        checked={reasonList.includes(reason.value)}
                    >
                        {reason.label}
                    </Checkbox>
                ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
                <strong>Đã chọn:</strong>{" "}
                {reasonList.length === 0
                    ? "Chưa chọn lý do nào"
                    : reasonList.join(", ")}
            </div>
        </>
    );
};

export default Reason;
