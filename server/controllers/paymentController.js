const axios = require('axios');
const crypto = require('crypto');

const createOrder = async (req, res) => {
    const { amount, returnUrl, description } = req.body;
    try {
        const orderCode = Date.now();
        const cancelUrl = returnUrl;

        // Tạo signature đúng chuẩn
        const rawData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
        const signature = crypto.createHmac('sha256', process.env.PAYOS_CHEKSUM_KEY)
            .update(rawData)
            .digest('hex');

        const response = await axios.post('https://api-merchant.payos.vn/v2/payment-requests', {
            orderCode,
            amount,
            description,
            cancelUrl,
            returnUrl,
            signature
        }, {
            headers: {
                'x-client-id': process.env.PAYOS_CLIENT_ID,
                'x-api-key': process.env.PAYOS_API_KEY,
            }
        });

        res.json({ payUrl: response.data.data.checkoutUrl });
    } catch (err) {
        console.error('PayOS error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Tạo order thất bại', detail: err.response?.data || err.message });
    }
};

module.exports = { createOrder };