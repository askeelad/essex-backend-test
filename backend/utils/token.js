const jwt = require('jsonwebtoken');

const getAccessToken = (id) => {
    jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
}

const getRefreshToken = (id) => {
    jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

module.exports = {
    getAccessToken,
    getRefreshToken
}