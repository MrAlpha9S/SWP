import React from 'react';
import {
    useErrorStore, usePlanStore,
    useQuitReadinessStore,
    useQuittingMethodStore,
} from "../../../stores/store.js";
import ErrorText from "../../ui/errorText.jsx";
import {checkboxStyle, quittingMethodOptions} from "../../../constants/constants.js";
import {Radio} from "antd";
import {Column} from "@ant-design/plots"

const StartDate = () => {

    const {
        startDate,
        setStartDate,
        cigsPerDay,
        setCigsPerDay,
        quittingMethod,
        setQuittingMethod,
        cigsReduced,
        setCigsReduced,
        expectedQuitDate,
        setExpectedQuitDate,
        stoppedDate,
        setStoppedDate
    } = usePlanStore();
    const {readinessValue} = useQuitReadinessStore();
    const {errors} = useErrorStore();
    const today = new Date().toISOString().split('T')[0];

    function calculatePlan(startDate, dailyCigs, method, decreaseBy) {
        const date = new Date(startDate);
        const planLog = [];

        if (method === 'gradual-daily') {
            for (let i = dailyCigs; i > 0; i - decreaseBy) {
                const log = {date: '1'}
            }
        }
    }

    return (
        <>
            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                5. Lên kế hoạch
            </h2>

            {readinessValue === "ready" &&
                <>
                    <div className="text-left text-sm md:text-base">
                        <p>
                            Việc lên kế hoạch cụ thể là một bước quan trọng giúp bạn tiến gần hơn đến mục tiêu bỏ thuốc.
                            Một kế hoạch rõ ràng sẽ giúp bạn biết mình đang ở đâu trong hành trình thay đổi và từng bước tiến bộ ra sao.
                            Bạn hãy chọn ngày bắt đầu, số lượng thuốc bạn hút mỗi ngày và tốc độ bạn muốn giảm dần.
                            Tùy vào thói quen và khả năng của mình, bạn có thể chọn giảm mỗi ngày, mỗi tuần hoặc đặt ra ngày muốn bỏ hoàn toàn.
                            Hãy chọn phương pháp phù hợp với bạn nhất – đây sẽ là nền tảng để bạn theo dõi, duy trì và đạt được mục tiêu bỏ thuốc.
                        </p>
                    </div>

                    <form className="w-[60%] flex flex-col gap-3">

                        <label htmlFor="startDate" className="block text-sm md:text-base text-gray-700">
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

                        <div>
                            <input
                                id="startDate"
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="cigsPerInterval" className="block text-sm md:text-base text-gray-700 mb-1">
                                Bạn thường hút bao nhiêu điếu một ngày?
                            </label>
                            <div className=''>
                                {errors.map((error, index) => {
                                    if (error.location === "cigsPerDay") {
                                        return (
                                            <ErrorText key={index}>{error.message}</ErrorText>
                                        )
                                    }
                                })}
                            </div>
                            <div className='flex gap-1'>
                                <input
                                    onChange={(e) => setCigsPerDay(e.target.value)}
                                    id="cigsPerInterval"
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={cigsPerDay}
                                />
                            </div>

                        </div>

                        <p className="block text-sm md:text-base text-gray-700 mb-1">Hãy chọn phương pháp:</p>
                        <div className=''>
                            {errors.map((error, index) => {
                                if (error.location === "quitMethod") {
                                    return (
                                        <ErrorText key={index}>{error.message}</ErrorText>
                                    )
                                }
                            })}
                        </div>

                        <Radio.Group
                            onChange={(e) => setQuittingMethod(e.target.value)}
                            value={quittingMethod}
                            options={quittingMethodOptions}
                            size="large"
                            style={checkboxStyle}
                        />

                        {(quittingMethod === "target-date") ? (
                            <>
                                <div className='block text-sm md:text-base text-gray-700 mb-1'>
                                    <h3>Hãy chọn ngày mà bạn quyết định ngừng hút</h3>
                                </div>

                                <div className='my-[-30]'>
                                    {errors.map((error, index) => {
                                        if (error.location === "expectedQuitDate") {
                                            return (
                                                <ErrorText key={index}>{error.message}</ErrorText>
                                            )
                                        }
                                    })}
                                </div>

                                <form className="w-[60%] flex flex-col gap-3">
                                    <div>
                                        <input
                                            id="stopDate"
                                            type="date"
                                            min={today}
                                            value={expectedQuitDate}
                                            onChange={e => setExpectedQuitDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <label htmlFor="cigsPerInterval"
                                       className="block text-sm md:text-base text-gray-700 mb-1">
                                    Bạn quyết định giảm bao nhiêu điếu thuốc
                                    mỗi {quittingMethod === 'gradual-daily' ? 'ngày' : 'tuần'}?
                                </label>
                                <div className=''>
                                    {errors.map((error, index) => {
                                        if (error.location === "cigsReduced") {
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
                                    onChange={(e) => setCigsReduced(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </>
                        )}

                    </form>

                </>}


            {readinessValue === "relapse-support" &&
                <>
                    <div className="text-left text-sm md:text-base">
                        <p>
                            Việc duy trì trạng thái không hút thuốc có thể đầy thách thức, nhất là trong những lúc căng thẳng,
                            mệt mỏi hoặc khi đối mặt với thói quen cũ. Việc xác định rõ ngày bạn đã ngừng hút sẽ giúp bạn theo
                            dõi hành trình của mình, xây dựng động lực và nhận diện các thời điểm dễ tái nghiện. Hãy cùng nhau
                            xây dựng các chiến lược phòng ngừa tái nghiện để bạn có thể giữ vững thành quả đã đạt được.
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
                        <div>
                            <input
                                id="stopDate"
                                type="date"
                                min={today}
                                value={stoppedDate}
                                onChange={e => setStoppedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </>}


            <div className="mt-4 text-sm text-gray-600">
                <strong>Đã chọn:</strong>{" "}
                {startDate}
            </div>

        </>
    );
};

export default StartDate;