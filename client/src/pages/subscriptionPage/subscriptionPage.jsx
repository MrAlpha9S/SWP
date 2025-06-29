import React, {useState} from 'react';
import {Check, Crown, Zap, Shield, Users, BarChart3, Headphones, Sparkles, Star} from 'lucide-react';
import {useAuth0} from "@auth0/auth0-react";
import {
    useCigsPerPackStore, useGoalsStore, usePlanStore,
    usePricePerPackStore,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore,
    useUserInfoStore
} from "../../stores/store.js";
import {useNavigate} from "react-router-dom";
import {saveProfileToLocalStorage} from "../../components/utils/profileUtils.js";

function SubscriptionPage() {
    const [isYearly, setIsYearly] = useState(false);

    const premiumMonthlyPrice = 300000;
    const premiumYearlyPrice = 2400000; // 2 months free
    const yearlyDiscount = Math.round(((premiumMonthlyPrice * 12 - premiumYearlyPrice) / (premiumMonthlyPrice * 12)) * 100);
    const {userInfo} = useUserInfoStore()
    const {loginWithRedirect} = useAuth0();
    const navigate = useNavigate();

    const freeFeatures = [
        'Bài viết và blog giáo dục về Thuốc lá',
        'Các công cụ theo dõi cơ bản',
        'Các hoạt động cai thuốc',
        'Tham gia cộng đồng người dùng',
    ];

    const premiumFeatures = [
        'Tất cả chức năng trong gói Miễn phí',
        'Lên kế hoạch cai thuốc với lộ trình rõ ràng và dễ theo dõi',
        'Trao đổi 24/24 trực tiếp với Huấn luyện viên',
    ];

    const handleSignUpButton = () => {
        const state = saveProfileToLocalStorage({currentStep : 6, referrer : 'subscriptionPage', userInfo : userInfo})
        localStorage.setItem('onboarding_profile', JSON.stringify(state));

        loginWithRedirect({authorizationParams: {screen_hint: 'signup'}})
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50  to-primary-100">
            <div className='h-[400px] bg-[url(/subscription-hero.jpg)] bg-no-repeat bg-cover flex'></div>
            <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-b border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <h1 className="text-4xl sm:text-5xl h-[80px] lg:text-6xl font-bold bg-primary-500 bg-clip-text text-transparent mb-6">
                        Chọn gói
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Bắt đầu miễn phí để trải nghiệm nền tảng của chúng tôi. Nâng cấp khi bạn sẵn sàng nghiêm túc với hành trình cai thuốc của mình.
                    </p>

                    {/* Billing Toggle */}
                    <div
                        className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200 mb-8">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                !isYearly
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Hàng tháng
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 relative ${
                                isYearly
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Hàng năm
                            <span
                                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Tiết kiệm {yearlyDiscount}%
              </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Free Tier */}
                    <div
                        className="relative flex flex-col bg-white rounded-2xl h-[550px] shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-center mb-8">
                            <div
                                className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-4">
                                <Zap className="h-6 w-6 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Miễn phí</h3>
                            <p className="text-gray-600 mb-6">Trải nghiệm nền tảng</p>

                            <div className="mb-8">
                                <span className="text-5xl font-bold text-gray-900">0 VNĐ</span>
                                <span className="text-gray-600 ml-2">Không giới hạn</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {freeFeatures.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"/>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {!userInfo && <button
                            onClick={() => handleSignUpButton()}
                            className="w-full mt-auto bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors duration-200 shadow-lg hover:shadow-xl">
                            Tạo tài khoản
                        </button>}
                    </div>

                    {/* Premium Tier */}
                    <div
                        className="relative flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-2xl border-2 border-primary-500 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div
                                className=" bg-primary-500 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg">
                                <Crown className="h-4 w-4 mr-2"/>
                                Phổ biến
                            </div>
                        </div>

                        <div className="text-center mb-8 pt-4">
                            <div
                                className="inline-flex items-center justify-center p-3  bg-primary-500 rounded-full mb-4">
                                <Crown className="h-6 w-6 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                            <p className="text-gray-600 mb-6">Dành cho người dùng cần sự theo dõi và giúp đỡ của các Chuyên gia</p>

                            <div className="mb-8">
                <span
                    className="text-5xl font-bold  bg-primary-500 bg-clip-text text-transparent">
                  {isYearly ? Math.round(premiumYearlyPrice / 12).toLocaleString('vi-VN') : premiumMonthlyPrice.toLocaleString('vi-VN')}
                </span>
                                <span className="text-gray-600 ml-2">
                  / {isYearly ? 'tháng' : 'tháng'}
                </span>
                                {isYearly && (
                                    <div className="text-sm text-green-600 font-medium mt-2">
                                        Thanh toán hàng năm {premiumYearlyPrice.toLocaleString('vi-VN')} <br/> Tiết kiệm {(premiumMonthlyPrice * 12 - premiumYearlyPrice).toLocaleString('vi-VN')}

                                    </div>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {premiumFeatures.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <div
                                        className="h-5 w-5  bg-primary-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <Check className="h-3 w-3 text-white"/>
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="w-full mt-auto bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                            Thanh toán
                        </button>

                        {/*<p className="text-center text-sm text-gray-500 mt-4">*/}
                        {/*    14-day free trial • No credit card required*/}
                        {/*</p>*/}
                    </div>
                </div>

                {/* Additional Features Section */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn Gói Premium?</h2>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Mở khóa tính năng tạo kế hoạch và kết nối với Huấn luyện viên để nâng cao khả năng bỏ thuốc của bạn.
                    </p>

                    <div className="flex justify-center max-w-4xl mx-auto">

                        <div className="text-center w-[50%] p-6">
                            <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-4">
                                <Users className="h-8 w-8 text-purple-600"/>
                            </div>
                            <h3 className="text-xl  font-semibold text-gray-900 mb-2">Tương tác với Huấn luyện viên</h3>
                            <p className="text-gray-600">Nhận sự theo sát và giúp đỡ từ Huấn luyện viên thông qua chức năng Chat. Huấn luyện viên cũng có thể tạo và chỉnh sửa kế hoạch cho bạn.</p>
                        </div>

                        <div className="text-center p-6 w-[50%] ">
                            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
                                <BarChart3 className="h-8 w-8 text-green-600"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tạo và theo dõi kế hoạch cai thuốc</h3>
                            <p className="text-gray-600">Lên kế hoạch giảm thuốc theo ngày, tuần, theo nhiều giai đoạn. Dễ dàng theo dõi kế hoạch với biểu đồ trong Bảng điều khiển.</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Câu hỏi Thường gặp</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tôi có thể hủy bất cứ lúc nào không?</h3>
                            <p className="text-gray-600">Có, bạn có thể hủy gói đăng ký bất cứ lúc nào mà không cần lý do.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn có hoàn tiền không?</h3>
                            <p className="text-gray-600">Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày cho tất cả các gói Premium.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn chấp nhận những phương thức thanh toán nào?</h3>
                            <p className="text-gray-600">Chúng tôi chấp nhận chuyển khoản ngân hàng bằng mã QR.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tôi có thể nâng cấp hoặc hạ cấp gói không?</h3>
                            <p className="text-gray-600">Có, bạn có thể thay đổi gói bất cứ lúc nào trong phần cài đặt tài khoản của bạn.</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default SubscriptionPage;