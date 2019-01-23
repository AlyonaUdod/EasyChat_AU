function ExtractJwt (req) {
    let token = null;
    if (req.cook && req.cookies.token !== void(0)) {
        token = req.cookies['token'];
    }
    return token
}

module.exports = {
    jwt: {
        jwtFromRequest: ExtractJwt,
        secretOrKey: 'koen7hYu916TgsbfgG'
    },

    expiresIn: '1 day'
}