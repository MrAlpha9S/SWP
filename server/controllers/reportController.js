const {AddReport} = require("../services/reportService");

const handleAddReport = async (req, res) => {
    const {auth0_id, post_id, comment_id, reason, description, created_at}  = req.body;

    if (!auth0_id || !reason || !created_at) {
        return res.status(400).json({ success: false, message: 'error in handleAddReport: params is required', data: null });
    }

    try {
        const add = await AddReport(auth0_id, post_id, comment_id, reason, description, created_at);
        if (!add) {
            return res.status(404).json({ success: false, message: 'Cant handleAddReport', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleAddReport successfully', data: add });
    } catch (error) {
        console.error('Error in handleAddReport:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

module.exports = {handleAddReport}