import React from 'react';
import {
    useCigsPerDayStore,
    useCigsPerPackStore,
    usePricePerPackStore,
} from "../../../stores/store.js";

const CigInfo = () => {
    const {pricePerPack, setPricePerPack} = usePricePerPackStore();
    const {cigsPerPack, setCigsPerPack} = useCigsPerPackStore();
    const {cigsPerDay, setCigsPerDay} = useCigsPerDayStore();

    return (
        <>
            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>3. Thông tin về thuốc lá bạn sử
                dụng</h2>
            <form className="w-[60%] flex flex-col gap-3">
                <div>
                    <label htmlFor="pricePerPack" className="block text-sm md:text-base mb-1">
                        Một gói thuốc bạn thường hút có giá bao nhiêu?
                    </label>
                    <input
                        onChange={(e) => setPricePerPack(e.target.value)}
                        id="pricePerPack"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pricePerPack}
                    />
                </div>

                <div>
                    <label htmlFor="cigsPerPack"
                           className="block text-sm md:text-base text-gray-700 mb-1">
                        Có bao nhiêu điếu trong một gói thuốc bạn thường hút?
                    </label>
                    <input
                        onChange={(e) => setCigsPerPack(e.target.value)}
                        id="cigsPerPack"
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cigsPerPack}
                    />
                </div>

                <div>
                    <label htmlFor="interval" className="block text-sm md:text-base text-gray-700 mb-1">
                        Bạn thường hút bao nhiêu điếu?
                    </label>
                    <div className='flex gap-1'>
                        <select

                            id="interval"
                            name="interval"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="day">Ngày</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                        <input
                            onChange={(e) => setCigsPerDay(e.target.value)}
                            id="cigsPerInterval"
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={cigsPerDay}
                        />
                    </div>
                </div>
                <div>
                    Đã điền:
                    {pricePerPack} {cigsPerPack} {cigsPerDay}
                </div>

            </form>
        </>
    );
};

export default CigInfo;