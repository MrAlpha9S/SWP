const {getSubscriptions} = require("../services/subscriptionService");

const handleGetSubs = async (req, res) => {

    try {
        const subsResult = await getSubscriptions();
        if (!subsResult) {
            return res.status(404).json({ success: false, message: 'Subscription not found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Subscription fetched successfully', data: subsResult });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

module.exports = {handleGetSubs}