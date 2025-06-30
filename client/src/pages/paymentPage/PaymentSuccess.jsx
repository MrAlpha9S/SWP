import React from 'react';

function PaymentSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã thanh toán.</p>
        </div>
    );
}

export default PaymentSuccess;