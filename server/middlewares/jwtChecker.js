const {auth} = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
    audience: 'https://smokerecession.com',
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

module.exports = jwtCheck;