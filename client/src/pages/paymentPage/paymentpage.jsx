import React, { useState } from 'react';
import { createPayOSOrder } from '../../components/utils/paymentUtils';

function PaymentPage() {
    const [amount, setAmount] = useState(100000);
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const data = await createPayOSOrder(amount, window.location.origin + '/payment-success');
            window.location.href = data.payUrl; // Redirect sang PayOS
        } catch (err) {
            alert('Có lỗi xảy ra!');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Thanh toán EzQuit</h1>
            <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="border px-4 py-2 mb-4"
                min={1000}
            />
            <button
                onClick={handlePay}
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded"
            >
                {loading ? 'Đang chuyển...' : 'Thanh toán với PayOS'}
            </button>
        </div>
    );
}

export default PaymentPage;