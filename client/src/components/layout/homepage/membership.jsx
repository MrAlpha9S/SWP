import {FiCheck} from 'react-icons/fi'
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getSubscriptionList} from "../../utils/subsriptionUtils.js";
import CustomButton from "../../ui/CustomButton.jsx";

function Membership() {
    const { loginWithRedirect } = useAuth0();
    const [subscriptionList, setSubscriptionList] = useState([]);

    const {isPending: isSubscriptionListPending, data: fetchedSubscriptionList} = useQuery({
        queryKey: ['all-checkin-data'],
        queryFn: async () => {
            return await getSubscriptionList();
        },
    })

    useEffect(() => {
        if (!isSubscriptionListPending) {
            setSubscriptionList(fetchedSubscriptionList.data);
        }
    }, [isSubscriptionListPending])

    const handleClick = (price) => {
        if (price === 0) {
            loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
        } else {
            //proceed to payment
        }
    }


    return (
        <section className="py-16 min-h-[618px] flex flex-col">
            <div className="container-custom flex flex-1 flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
                    Gói đăng ký
                </h2>
                <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                    Chọn gói đăng ký phù hợp với nhu cầu của bạn.
                </p>
                <div className="flex flex-1 justify-center gap-8">
                    {(subscriptionList?.length > 0 && !isSubscriptionListPending) && subscriptionList?.map((subs, index) => (
                        <div
                            key={index}
                            className={`w-[50%] flex flex-col card hover:shadow-lg relative `}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                                {subs.name}
                            </h3>
                            <p className="text-2xl md:text-3xl font-bold text-center text-primary-600 mb-6">
                                {subs.price === 0 ? 'Miễn phí' : `${subs.price.toLocaleString()} VNĐ`}
                            </p>
                            <ul className="mb-8 flex flex-col flex-1 space-y-3">
                                {subs.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <FiCheck className="text-success-500 mr-2 flex-shrink-0"/>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <CustomButton
                                className={`w-full`}
                                onClick={() => handleClick(subs.price)}
                            >
                                {subs.price === 0 ? 'Đăng ký' : 'Tìm hiểu thêm'}
                            </CustomButton>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Membership