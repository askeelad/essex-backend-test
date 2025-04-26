const jwt = require('jsonwebtoken');

const getAccessToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.JWT_TOKEN_EXPIRY),
      });
}

const getRefreshToken = (id) => {
    return jwt.sign({id: id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
      });
}

module.exports = {
    getAccessToken,
    getRefreshToken
}