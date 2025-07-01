const PayOS = require("@payos/node");

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

const createOrder = async (req, res) => {
    const { amount, description, returnUrl } = req.body;
    try {
        const orderCode = Date.now();
        const cancelUrl = returnUrl;

        const order = {
            amount: amount,
            description: description,
            orderCode: orderCode,
            items: [
                {
                    name: description,
                    quantity: 1,
                    price: amount
                }
            ],
            returnUrl: returnUrl,
            cancelUrl: cancelUrl,
        };

        const paymentLink = await payos.createPaymentLink(order);
        res.json({ payUrl: paymentLink.checkoutUrl });

    } catch (err) {
        console.error('PayOS error:', err);
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(500).json({ error: 'Tạo order thất bại', detail: err.response.data });
        } else if (err.request) {
            // The request was made but no response was received
            res.status(500).json({ error: 'Tạo order thất bại', detail: 'No response from PayOS server' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ error: 'Tạo order thất bại', detail: err.message });
        }
    }
};

module.exports = { createOrder };