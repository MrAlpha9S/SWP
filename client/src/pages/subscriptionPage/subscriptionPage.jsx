import React, {useEffect, useRef, useState} from 'react';
import {Check, Crown, Zap, Users, BarChart3} from 'lucide-react';
import {useAuth0} from "@auth0/auth0-react";
import {
    useQuitReadinessStore,
    useUserInfoStore
} from "../../stores/store.js";
import {saveProfileToLocalStorage} from "../../components/utils/profileUtils.js";
import {useMutation} from "@tanstack/react-query";
import {updateUserSubscription} from "../../components/utils/userUtils.js";
import {Modal} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import CongratulationPage from "./CongratulationPage.jsx";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";
import {usePayOS} from "@payos/payos-checkout";
import axios from "axios";
import {queryClient} from "../../main.jsx";

function SubscriptionPage() {
    const [isYearly, setIsYearly] = useState(false);

    const premiumMonthlyPrice = 300000;
    const premiumYearlyPrice = 2400000; // 2 months free
    const yearlyDiscount = Math.round(((premiumMonthlyPrice * 12 - premiumYearlyPrice) / (premiumMonthlyPrice * 12)) * 100);
    const {userInfo} = useUserInfoStore()
    const {loginWithRedirect, user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [subscriptionData, setSubscriptionData] = useState();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentLink, setPaymentLink] = useState(null);
    const hasPaidRef = useRef(false);

    const {from} = useParams();

    const {
        data: paymentData,
        open: openPayOS,
        exit: exitPayOS
    } = usePayOS({
        RETURN_URL: `http://localhost:5173/payment-success`,
        ELEMENT_ID: 'payos-container',
        CHECKOUT_URL: paymentLink,
        onExit: () => {
            setIsPaymentModalOpen(false);
            setPaymentLink(null);
        },
        onSuccess: () => {
            if (hasPaidRef.current) return;
            hasPaidRef.current = true;

            setIsPaymentModalOpen(false);
            const id = isYearly ? 3 : 2;
            subscriptionMutation.mutate(id);
        },
        onError: () => {
            console.log('Payment failed');
            setIsPaymentModalOpen(false);
        }
    });

    useEffect(() => {
        if (paymentLink) {
            openPayOS();
        }
    }, [paymentLink, openPayOS]);

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

    const paymentMutation = useMutation({
        mutationFn: async (paymentInfo) => {
            const res = await axios.post('/api/v1/payment/create-order', paymentInfo);
            return res.data;
        },
        onSuccess: (data) => {
            setPaymentLink(data.payUrl);
            setIsPaymentModalOpen(true);
        },
        onError: (error) => {
            console.error("Payment failed:", error);
        }
    });

    const subscriptionMutation = useMutation({
        mutationFn: async (subscriptionId) => {
            return await updateUserSubscription(user, getAccessTokenSilently, isAuthenticated, subscriptionId);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['user-profile'])
            setSubscriptionData(data.data);
            setIsModalOpen(true);
        },
        onError: (error) => {
            console.error("Mutation failed:", error);
        }
    });

    const handleSignUpButton = () => {
        if (from) {
            if (from === 'onboarding-step-5') {
                const state = saveProfileToLocalStorage({
                    currentStep: 6,
                    referrer: 'subscriptionPage',
                    userInfo: userInfo
                })
                localStorage.setItem('onboarding_profile', JSON.stringify(state));
            }
        }
        loginWithRedirect({authorizationParams: {screen_hint: 'signup'}})
    }

    const handlePaymentButton = () => {
        const amount = isYearly ? premiumYearlyPrice : premiumMonthlyPrice;
        const description = isYearly ? 'Premium - 1 Nam' : 'Premium - 1 Thang';
        const returnUrl = `http://localhost:5173/payment-success`;
        const paymentInfo = {amount, description, returnUrl};

        if (!isAuthenticated) {
            if (from === 'onboarding-step-5') {
                const state = saveProfileToLocalStorage({
                    currentStep: 5,
                    referrer: 'onboarding-step-5-payment',
                    userInfo: userInfo
                })
                localStorage.setItem('onboarding_profile', JSON.stringify(state));
                loginWithRedirect({authorizationParams: {screen_hint: 'login'}});
            } else {
                localStorage.setItem('referrerPayment', JSON.stringify({referrer: 'subscriptionPagePayment'}));
            }

        } else {
            if (from === 'coach-dashboard') {
                paymentMutation.mutate(paymentInfo);
            } else if (from === 'onboarding-step-5-payment') {
                paymentMutation.mutate(paymentInfo);
            } else {
                paymentMutation.mutate(paymentInfo);
            }

        }
    };


    return (
        <PageFadeWrapper>
            <div className="min-h-screen bg-gradient-to-br from-primary-50  to-primary-100">
                <div className='h-[400px] bg-[url(/subscription-hero.jpg)] bg-no-repeat bg-cover flex'></div>
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-b border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                        <h1 className="text-4xl sm:text-5xl h-[80px] lg:text-6xl font-bold bg-primary-500 bg-clip-text text-transparent mb-6">
                            Chọn gói
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Bắt đầu miễn phí để trải nghiệm nền tảng của chúng tôi. Nâng cấp khi bạn sẵn sàng nghiêm túc
                            với hành trình cai thuốc của mình.
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
                                <p className="text-gray-600 mb-6">Dành cho người dùng cần một kế hoạch rõ ràng, sự theo
                                    dõi và giúp đỡ của các Chuyên gia</p>

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
                                            Thanh toán hàng năm {premiumYearlyPrice.toLocaleString('vi-VN')} <br/> Tiết
                                            kiệm {(premiumMonthlyPrice * 12 - premiumYearlyPrice).toLocaleString('vi-VN')}

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
                                disabled={
                                    subscriptionMutation.isLoading ||
                                    (userInfo && userInfo.sub_id !== 1)
                                }
                                onClick={() => handlePaymentButton()}
                                className={`w-full mt-auto bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg ${
                                    subscriptionMutation.isLoading || (userInfo && userInfo.sub_id !== 1)
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:shadow-xl'
                                }`}
                            >
                                {!userInfo
                                    ? 'Tạo tài khoản'
                                    : subscriptionMutation.isLoading
                                        ? 'Đang xử lý...'
                                        : userInfo.sub_id !== 1
                                            ? 'Bạn đã trở thành thành viên Premium'
                                            : 'Thanh toán'}
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
                            Mở khóa tính năng tạo kế hoạch và kết nối với Huấn luyện viên để nâng cao khả năng bỏ thuốc
                            của bạn.
                        </p>

                        <div className="flex justify-center max-w-4xl mx-auto">

                            <div className="text-center w-[50%] p-6">
                                <div
                                    className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-4">
                                    <Users className="h-8 w-8 text-purple-600"/>
                                </div>
                                <h3 className="text-xl  font-semibold text-gray-900 mb-2">Tương tác với Huấn luyện
                                    viên</h3>
                                <p className="text-gray-600">Nhận sự theo sát và giúp đỡ từ Huấn luyện viên thông qua
                                    chức năng Chat. Huấn luyện viên cũng có thể tạo và chỉnh sửa kế hoạch cho bạn.</p>
                            </div>

                            <div className="text-center p-6 w-[50%] ">
                                <div
                                    className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
                                    <BarChart3 className="h-8 w-8 text-green-600"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tạo và theo dõi kế hoạch cai
                                    thuốc</h3>
                                <p className="text-gray-600">Lên kế hoạch giảm thuốc theo ngày, tuần, theo nhiều giai
                                    đoạn. Dễ dàng theo dõi kế hoạch với biểu đồ trong Bảng điều khiển.</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Câu hỏi Thường gặp</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tôi có thể hủy bất cứ lúc nào
                                    không?</h3>
                                <p className="text-gray-600">Có, bạn có thể hủy gói đăng ký bất cứ lúc nào mà không cần
                                    lý do.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn có hoàn tiền không?</h3>
                                <p className="text-gray-600">Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày
                                    cho tất cả các gói Premium.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn chấp nhận những phương thức
                                    thanh toán nào?</h3>
                                <p className="text-gray-600">Chúng tôi chấp nhận chuyển khoản ngân hàng bằng mã QR.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tôi có thể nâng cấp hoặc hạ cấp
                                    gói không?</h3>
                                <p className="text-gray-600">Có, bạn có thể thay đổi gói bất cứ lúc nào trong phần cài
                                    đặt tài khoản của bạn.</p>
                            </div>
                        </div>
                    </div>

                </div>

                <Modal
                    title="Thanh toán PayOS"
                    width={500}
                    open={isPaymentModalOpen}
                    onCancel={() => {
                        exitPayOS();
                        setIsPaymentModalOpen(false);
                    }}
                    centered
                    footer={null}
                    maskClosable={false}
                    styles={{
                        body: { height: '550px' }
                    }}
                >
                    <div id="payos-container" style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}></div>
                </Modal>

                <Modal
                    width={700}
                    open={isModalOpen}
                    onCancel={() => navigate('/')}
                    centered
                    closable={false}
                    footer={null}
                    maskClosable={false}
                >
                    {subscriptionData && <CongratulationPage subscriptionData={subscriptionData} from={from}/>}
                </Modal>

                <button
                    onClick={() => {
                        setSubscriptionData({
                            sub_name: isYearly ? "Gói 12 tháng" : "Gói 1 tháng",
                            vip_end_date: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000),
                            price: isYearly ? 2400000 : 300000
                        });
                        setIsModalOpen(true);
                    }}
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 9999,
                        background: '#10b981',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    Test modal chúc mừng
                </button>

            </div>
        </PageFadeWrapper>

    );
}

export default SubscriptionPage;