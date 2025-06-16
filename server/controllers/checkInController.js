const {
    postCheckIn,
    getCheckInLogDataset,
    getCheckInDataService
} = require("../services/checkInService");

const handlePostCheckIn = async (req, res) => {
    const {
        userAuth0Id,
        feel,
        checkedQuitItems,
        cigsSmoked,
        freeText,
        qna, checkInDate
    } = req.body;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: null});

    try {
        const result = await postCheckIn(userAuth0Id,
            feel,
            checkedQuitItems,
            cigsSmoked,
            freeText,
            qna, checkInDate);

        if (!result) {
            return res.status(404).json({success: false, message: 'Check-in data insert failed', data: null});
        } else {
            return res.status(200).json({success: true, message: 'Check-in data insert successful', data: result});
        }
    } catch (err) {
        console.error('handleGetProfile error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const handleGetDataSet = async (req, res) => {
    const {
        userAuth0Id
    } = req.query;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: null});

    try {
        const result = await getCheckInLogDataset(userAuth0Id);

        if (!result) {
            return res.status(404).json({success: false, message: 'Check-in data set get failed', data: null});
        } else {
            return res.status(200).json({success: true, message: 'Check-in data set get successful', data: result});
        }
    } catch (err) {
        console.error('handleGetProfile error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const getCheckInData = async (req, res) => {
    const {
        userAuth0Id, date, action
    } = req.query;
    let result = []
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: result});

    try {

        let result = await getCheckInDataService(userAuth0Id, date, action);

        if (!result) {
            return res.status(404).json({success: false, message: 'Check-in not found', data: result});
        } else {
            return res.status(200).json({success: true, message: 'Check-in status get successful', data: result});
        }
    } catch (err) {
        console.error('isCheckedIn error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: result});
    }
}



module.exports = {handlePostCheckIn, handleGetDataSet, getCheckInData};