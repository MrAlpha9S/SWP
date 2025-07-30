import {useNavigate} from "react-router-dom";
import {useCurrentStepStore} from "../../stores/store.js";

const CongratulationPage = ({subscriptionData, from, hasCoach}) => {
    const {setCurrentStep} = useCurrentStepStore()
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = [
            'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
            'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
        ];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    };

    const CheckIcon = () => (
        <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
        </svg>
    );

    const SparkleIcon = ({className}) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
        </svg>
    );

    return (

        <div className="relative z-10 max-w-2xl w-full">
            <div className="bg-white/80 p-8 md:p-12 text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div
                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse-slow">
                            <CheckIcon/>
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <SparkleIcon className="w-6 h-6 text-yellow-400 animate-bounce-slow"/>
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
                    Chúc mừng! 🎉
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-slide-up">
                    Gói đăng ký của bạn đã được kích hoạt
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 animate-slide-up">
                    <h2 className="text-lg font-semibold text-emerald-800 mb-2">Thanh toán thành công ✓</h2>
                    <p className="text-emerald-700">
                        Chúc mừng bạn đã trở thành thành viên Premium! Gói đăng ký của bạn đã được xử lý thành công và
                        bạn hiện có quyền truy cập vào tất cả các tính năng cao cấp.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 animate-slide-up">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết đăng ký</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Gói:</span>
                            <span className="font-medium text-gray-800">{subscriptionData?.sub_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Thanh toán tiếp theo:</span>
                            <span className="font-medium text-gray-800">
                                    {formatDate(subscriptionData?.vip_end_date)}
                                </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-medium text-gray-800">
                                    {subscriptionData?.price.toLocaleString('vi-VN')} VNĐ
                                </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className="font-medium text-emerald-600">Đang hoạt động</span>
                        </div>
                    </div>
                </div>

                <div className="text-left mb-8 animate-slide-up">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tiếp theo là gì?</h3>
                    <div className="space-y-3">
                        {[
                            'Chọn Huấn luyện viên - người sẽ đồng hành cùng bạn',
                            'Tạo kế hoạch cai thuốc với chức năng tạo kế hoạch bởi hệ thống',
                            'Hoặc, trò chuyện với Huấn luyện viên của chúng tôi để cùng tạo kế hoạch cai thuốc cho riêng bạn.'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-600">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                    {!hasCoach && <>
                        <button
                            onClick={() => {
                                if (from === 'onboarding-step-5-payment') {
                                    setCurrentStep(5)
                                    navigate('/coach-selection/onboarding-step-5-payment')
                                } else if (from === 'coach-dashboard') {
                                    navigate('/coach-selection')
                                } else if (!from) {
                                    navigate('/coach-selection')

                                }
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200">
                            Chọn HLV
                        </button>
                        <button
                            onClick={() => {
                                if (from === 'onboarding-step-5-payment') {
                                    setCurrentStep(5)
                                }
                                navigate('/onboarding/onboarding-step-5-payment')
                            }
                            }
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200">
                            {from === 'onboarding-step-5-payment' ? 'Tiếp tục lên kế hoạch' : 'Bắt đầu lên kế hoạch'}
                        </button>
                    </>}
                    {/*<button className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">*/}
                    {/*    Xem bảng điều khiển*/}
                    {/*</button>*/}
                    {hasCoach && <button
                        onClick={() => {
                            navigate('/dashboard')
                        }
                        }
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200">
                        Tiếp tục đến Bảng điều khiển
                    </button>}
                </div>

                <div className="mt-8 text-center animate-slide-up">
                    <p className="text-gray-500 text-sm mb-2">Cần hỗ trợ để bắt đầu?</p>
                    <p className="text-gray-500 text-sm mb-2 font-medium">
                        Hãy nhấn bắt đầu để chọn Huấn luyện viên của chúng tôi. Sau đó hãy chat trực tiếp với họ để nhận
                        sự giúp đỡ.
                    </p>
                </div>
            </div>

            <div className="text-center mt-6 animate-fade-in">
                <p className="text-gray-500 text-sm">
                    Email xác nhận đã được gửi đến địa chỉ email đã đăng ký của bạn.
                </p>
            </div>
        </div>
    );
};

export default CongratulationPage;
