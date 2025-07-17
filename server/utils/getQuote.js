const {poolPromise, sql} = require("../configs/sqlConfig");

const getQuote = async () => {
    const numberOfQuotes = 30;
    try {
        // Generate random number from 1 to numberOfQuotes (inclusive)
        const randQuoteId = Math.floor(Math.random() * numberOfQuotes) + 1;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('quoteId', randQuoteId)
            .query('SELECT * from quotes WHERE quote_id = @quoteId');

        // Return the quote data
        return result.recordset[0];

    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

module.exports = {getQuote};