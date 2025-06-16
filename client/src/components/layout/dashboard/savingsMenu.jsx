import React from 'react';
import {
    useCigsPerPackStore,
    useCurrentStepDashboard,
    usePlanStore,
    usePricePerPackStore
} from "../../../stores/store.js";
import CustomButton from "../../ui/CustomButton.jsx";
import {useNavigate} from "react-router-dom";
import {savingsTiers} from "../../../constants/constants.js";

const SavingsMenu = () => {
    const {setCurrentStepDashboard} = useCurrentStepDashboard();
    const {cigsPerDay} = usePlanStore();
    const {cigsPerPack} = useCigsPerPackStore()
    const {pricePerPack} = usePricePerPackStore()
    const navigate = useNavigate();

    const dailySavings = (cigsPerDay * pricePerPack) / cigsPerPack;
    const timeframes = [
        { label: '1 tuần', value: dailySavings * 7 },
        { label: '1 tháng', value: dailySavings * 30 },
        { label: '3 tháng', value: dailySavings * 90 },
        { label: '6 tháng', value: dailySavings * 180 },
        { label: '1 năm', value: dailySavings * 365 },
        { label: '2 năm', value: dailySavings * 365 * 2 },
        { label: '5 năm', value: dailySavings * 365 * 5 },
        { label: '10 năm', value: dailySavings * 365 * 10 },
    ];

    const matchedTiers = timeframes.map(tf => {
        const tier = [...savingsTiers].reverse().find(t => tf.value >= t.amount);
        return {
            period: tf.label,
            saved: tf.value,
            tier: tier ?? null,
        };
    });

    return (
        <div className="max-w-4xl space-y-10">
            <div className='flex justify-between'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bạn có thể tiết kiệm bao nhiêu tiền?</h1>
                    <p className="text-gray-700 mt-2">
                        Tính toán số tiền bạn có thể tiết kiệm bằng cách bỏ hút thuốc.
                    </p>
                </div>
                <img className='w-[35%] h-auto' src='/savings.png' alt='savings figure'/>
            </div>

            <div className="bg-primary-100 border border-gray-200 rounded-md p-4 space-y-2 shadow-sm">
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold text-gray-800">Thông số của bạn</h2>
                    <a onClick={() => navigate('/onboarding/savings')}
                       className="text-sm text-primary-700 hover:underline cursor-pointer">
                        Chỉnh sửa?
                    </a>
                </div>
                <p className="text-gray-700">• Số điếu mỗi ngày bạn hút: <span className="font-medium">{cigsPerDay}</span></p>
                <p className="text-gray-700">• Số điếu có trong mỗi gói thuốc: <span className="font-medium">{cigsPerPack}</span></p>
                <p className="text-gray-700">• Giá tiền của mỗi gói thuốc: <span className="font-medium">{pricePerPack} VNĐ</span></p>
                <p className="text-gray-700">• Nếu bạn ngừng hút, bạn sẽ có thể tiết kiệm được số tiền tương ứng mỗi tuần, tháng, năm,...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedTiers.map(({ period, saved, tier }, idx) => (
                    <div key={idx} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                        <h3 className="text-base font-semibold text-gray-700 mb-1">⏱ {period}</h3>
                        <p className="text-lg font-bold text-green-700 mb-2">💰 {Math.round(saved).toLocaleString()} VNĐ</p>
                        {tier ? (
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {tier.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">Chưa đủ để đạt mốc tiêu dùng</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-primary-100 border border-primary-600 rounded-lg p-6 flex flex-col items-start gap-4">
                <h2 className="text-xl font-bold text-primary-800">Tự thưởng cho bản thân</h2>
                <p className="text-gray-800">
                    Hãy chọn một điều gì đó đặc biệt và đặt mục tiêu tiết kiệm – chúng tôi sẽ giúp bạn theo dõi tiến độ.
                </p>
                <CustomButton onClick={() => setCurrentStepDashboard('goals')}>
                    + Đặt mục tiêu tiết kiệm
                </CustomButton>
            </div>
        </div>
    );
};

export default SavingsMenu;
