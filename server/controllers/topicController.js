const { Topic } = require('../services/topicService');

const handleGetTopic = async (req, res) => {
    const  topic_id  = req.params.topic_id;
    if (!topic_id) {
        return res.status(400).json({ success: false, message: 'topic_id is required', data: null });
    }

    try {
        const topic = await Topic(topic_id);
        if (!topic) {
            return res.status(404).json({ success: false, message: 'Topic not found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Topic fetched successfully', data: topic });
    } catch (error) {
        console.error('Error in handleGetTopic:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

module.exports = {
    handleGetTopic
};