import React, {useEffect, useRef} from 'react';
import {
    useCigsPerPackStore,
    useErrorStore, usePlanStore, usePricePerPackStore,
    useQuitReadinessStore,
} from "../../../stores/store.js";
import ErrorText from "../../ui/errorText.jsx";
import {checkboxStyle, quittingMethodOptions} from "../../../constants/constants.js";
import {Radio} from "antd";
import CustomButton from "../../ui/CustomButton.jsx";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";
import calculatePlan from "../../utils/calculatePlan.js";


const SetPlan = () => {

    const {
        startDate,
        setStartDate,
        cigsPerDay,
        quittingMethod,
        setQuittingMethod,
        cigsReduced,
        setCigsReduced,
        expectedQuitDate,
        setExpectedQuitDate,
        stoppedDate,
        setStoppedDate,
        planLog,
        setPlanLog
    } = usePlanStore();

    const {readinessValue} = useQuitReadinessStore();
    const {errors} = useErrorStore();
    const today = new Date().toISOString().split('T')[0];
    const scrollRef = useRef(null);
    const frequencyLabel = quittingMethod === "gradual-weekly" ? "tuần" : "ngày";
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!scrollRef.current) return
            const yOffset = -130;
            const y = scrollRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }, 100)
        return () => {
            clearTimeout(timeout);
        }
    }, [planLog]);

    const createPlan = () => {
        if (startDate.length > 0 && cigsPerDay > 0 && quittingMethod.length > 0) {
            if (quittingMethod === 'target-date' && expectedQuitDate.length > 0) {
                setPlanLog(calculatePlan(startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate));
            } else if (quittingMethod !== 'target-date' && cigsReduced > 0) {
                setPlanLog(calculatePlan(startDate, cigsPerDay, quittingMethod, cigsReduced))
            }
        }
    }

    useEffect(() => {
        if (planLog.length > 0 && readinessValue === 'ready' && quittingMethod !== 'target-date') {
            setExpectedQuitDate(planLog[planLog.length - 1].date)
        }
    }, [planLog])

    return (
        <>
            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                5. {readinessValue === 'ready' ? ' Lên kế hoạch' : ' Kết quả & theo dõi'}
            </h2>

            {readinessValue === "ready" &&
                <>
                    <div className="text-left text-sm md:text-base">
                        <p>
                            Việc lên kế hoạch cụ thể là một bước quan trọng giúp bạn tiến gần hơn đến mục tiêu bỏ thuốc.
                            Một kế hoạch rõ ràng sẽ giúp bạn biết mình đang ở đâu trong hành trình thay đổi và từng bước
                            tiến bộ ra sao.
                            Bạn hãy chọn ngày bắt đầu, số lượng thuốc bạn hút mỗi ngày và tốc độ bạn muốn giảm dần.
                            Tùy vào thói quen và khả năng của mình, bạn có thể chọn giảm mỗi ngày, mỗi tuần hoặc đặt ra
                            ngày muốn bỏ hoàn toàn.
                            Hãy chọn phương pháp phù hợp với bạn nhất – đây sẽ là nền tảng để bạn theo dõi, duy trì và
                            đạt được mục tiêu bỏ thuốc.
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

                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                                    onChange={(e) => setCigsReduced(Number(e.target.value))}
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
                        <div>
                            <input
                                id="stopDate"
                                type="date"
                                max={today}
                                value={stoppedDate}
                                onChange={e => setStoppedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <p className='text-left font-bold text-base md:text-lg'>
                            Thống kê kết quả
                        </p>
                        <p className='text-sm md:text-base'>
                            Kể từ khi bạn bỏ thuốc từ ngày <strong>{stoppedDate}</strong>, bạn đã: <br/>
                            Bỏ thuốc
                            được <strong>{Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24))}</strong> ngày <br/>
                            Bỏ được <strong>
                            {Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay}
                        </strong> điếu thuốc <br/>
                            Tiết kiệm
                            được <strong>{(Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay * (pricePerPack / cigsPerPack)).toLocaleString("vi-VN")} VNĐ</strong>
                            <br/>
                            <em>Hãy giữ vững tinh thần nhé!</em>

                        </p>
                    </form>
                </>}
            {readinessValue === 'ready' && (
                <>
                    <CustomButton type="primary" onClick={createPlan}>Tạo kế hoạch</CustomButton>

                    {planLog.length > 0 && (
                        <>
                            <div className="mt-8 text-left font-bold text-base md:text-lg" ref={scrollRef}>
                                <h3>Tổng quan kế hoạch</h3>
                            </div>

                            <div className="text-sm md:text-base">
                                <p>
                                    Dựa trên thông tin bạn đã nhập, biểu đồ cho thấy kế hoạch{" "}
                                    {
                                        quittingMethod === "target-date"
                                            ? "giảm dần số lượng thuốc lá bạn hút mỗi ngày cho đến ngày bạn chọn"
                                            : `giảm dần số lượng thuốc lá bạn hút mỗi ${frequencyLabel}`
                                    }, bắt đầu từ <strong>{startDate}</strong> với mức ban đầu là{" "}
                                    <strong>{cigsPerDay}</strong>,{" "}
                                    {
                                        quittingMethod === "target-date"
                                            ? "và sẽ giảm dần cho đến khi số điếu về 0"
                                            : <>mỗi {frequencyLabel} giảm <strong>{cigsReduced}</strong> điếu</>
                                    }. Nếu bạn giữ đúng kế hoạch này, bạn sẽ hoàn toàn ngừng hút thuốc vào{" "}
                                    <strong>{planLog[planLog.length - 1].date}</strong>.
                                </p>

                                <ul>
                                    <li><strong>Trục ngang (ngày):</strong> hiển thị các ngày trong kế hoạch từ lúc bắt
                                        đầu đến ngày kết thúc.
                                    </li>
                                    <li><strong>Trục dọc (số điếu thuốc):</strong> cho thấy số lượng bạn nên hút mỗi
                                        ngày tương ứng.
                                    </li>
                                    <li><strong>Đường kẻ giảm dần:</strong> thể hiện lộ trình cai thuốc đều đặn và rõ
                                        ràng.
                                    </li>
                                </ul>

                                <p>
                                    👉 <em>Hãy dùng biểu đồ này để theo dõi sự tiến bộ của bạn mỗi ngày. Bạn đang từng
                                    bước tiến gần hơn đến mục tiêu bỏ thuốc hoàn toàn!</em>
                                </p>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={planLog} margin={{top: 20, right: 30, left: 20, bottom: 25}}>
                                    <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                    <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                    <YAxis/>
                                    <Tooltip/>
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default SetPlan;