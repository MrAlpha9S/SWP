const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const jwtCheckConfig = {
    audience: `https://${process.env.AUTH0_AUDIENCE}`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
};

const client = jwksRsa({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            callback(err);
        } else {
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        }
    });
}

function socketJwtMiddleware(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error: token required'));
        }

        jwt.verify(token, getKey, jwtCheckConfig, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: invalid token'));
            }

            socket.user = decoded;
            next();
        });
    });
}

module.exports = socketJwtMiddleware;
