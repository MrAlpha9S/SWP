import React from 'react';
import {useStartDateStore} from "../../../stores/store.js";

const StartDate = () => {

    const { startDate, setStartDate } = useStartDateStore();

    return (
        <>
            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                5. Chọn ngày bắt đầu
            </h2>

            <div className="text-left text-sm md:text-base">
                <p>
                    Ngày bắt đầu của bạn là ngày bạn sẽ cai thuốc, và việc đặt ra một ngày cụ thể sẽ
                    giúp bạn đi đúng hướng.
                    Chúng tôi khuyên bạn nên chọn một ngày trong vòng 2 tuần tới.
                    Hãy chọn một ngày mà:
                    <br/>
                    - Bạn sẽ ít căng thẳng hoặc áp lực hơn. <br/>
                    - Bạn ít có khả năng tiếp xúc với người khác đang hút thuốc. <br/>
                    - Kế hoạch của bạn sẽ bao gồm nhiều mẹo giúp bạn chuẩn bị cho một khởi đầu vững chắc
                    hơn.
                </p>
            </div>

            <div className='text-left font-bold text-base md:text-lg'>
                <h3>Hãy chọn ngày mà bạn quyết định ngừng hút</h3>
            </div>

            <form className="w-[60%] flex flex-col gap-3">
                <div>
                    <input
                        id="stopDate"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </form>

            <div className="mt-4 text-sm text-gray-600">
                <strong>Đã chọn:</strong>{" "}
                {startDate}
            </div>

        </>
    );
};

export default StartDate;