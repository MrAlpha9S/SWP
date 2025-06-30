import axios from 'axios';

export async function createPayOSOrder(amount, returnUrl) {
    const description = 'EzQuit01';
    const res = await axios.post('http://localhost:3000/payment/create-order', {
        amount,
        description,
        returnUrl
    });
    return res.data;
}