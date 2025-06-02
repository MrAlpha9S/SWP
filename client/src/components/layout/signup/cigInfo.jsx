import React from 'react';
import {
    useCigsPerPackStore, useErrorStore, usePlanStore,
    usePricePerPackStore,
} from "../../../stores/store.js";
import ErrorText from "../../ui/errorText.jsx";

const CigInfo = () => {
    const {pricePerPack, setPricePerPack} = usePricePerPackStore();
    const {cigsPerPack, setCigsPerPack} = useCigsPerPackStore();
    const {cigsPerDay, setCigsPerDay} = usePlanStore()
    const {errors} = useErrorStore();

    return (
        <>
            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>3. Thông tin về thuốc lá bạn sử
                dụng</h2>
            <div className="text-left text-sm md:text-base">
                <p>
                    Việc hiểu rõ thói quen hút thuốc hiện tại sẽ giúp bạn theo dõi quá trình thay đổi và nhìn thấy rõ lợi ích
                    kinh tế từ việc cai thuốc. Hãy cung cấp thông tin về giá của một gói thuốc bạn thường mua và số lượng điếu
                    trong mỗi gói. Những con số này không chỉ giúp bạn tính được chi phí đã tiết kiệm mà còn tạo thêm động lực
                    rõ ràng và thực tế trong hành trình bỏ thuốc.
                </p>
            </div>
            <form className="w-[60%] flex flex-col gap-3">
                <div>
                    <label htmlFor="pricePerPack" className="block text-sm md:text-base mb-1">
                        Một gói thuốc bạn thường hút có giá bao nhiêu?
                    </label>
                    <input
                        onChange={(e) => setPricePerPack(Number(e.target.value))}
                        id="pricePerPack"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pricePerPack}
                    />
                </div>
                <div className=''>
                    {errors.map((error, index) => {
                        if (error.location === "pricePerPack") {
                            return (
                                <ErrorText key={index}>{error.message}</ErrorText>
                            )
                        }
                    })}
                </div>

                <div>
                    <label htmlFor="cigsPerPack"
                           className="block text-sm md:text-base text-gray-700 mb-1">
                        Có bao nhiêu điếu trong một gói thuốc bạn thường hút?
                    </label>
                    <input
                        onChange={(e) => setCigsPerPack(Number(e.target.value))}
                        id="cigsPerPack"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cigsPerPack}
                    />
                </div>
                <div className=''>
                    {errors.map((error, index) => {
                        if (error.location === "cigsPerPack") {
                            return (
                                <ErrorText key={index}>{error.message}</ErrorText>
                            )
                        }
                    })}
                </div>
                <label htmlFor="cigsPerInterval" className="block text-sm md:text-base text-gray-700 mb-1">
                    Bạn đã thường hút bao nhiêu điếu một ngày?
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
                        onChange={(e) => setCigsPerDay(Number(e.target.value))}
                        id="cigsPerInterval"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cigsPerDay}
                    />
                </div>

                <div>
                    Đã điền:
                    {pricePerPack} {cigsPerPack}
                </div>

            </form>
        </>
    );
};

export default CigInfo;