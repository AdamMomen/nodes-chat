const jwt = require('jsonwebtoken');
// middleware @function 
// req @params object 
// res @params object 
//jwt requset handeler middleware for token vertification
function middleware(req, res, next) {
    const token = req.headers['authorization'].replace('bearer ', '');
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch {
        res.send('invalid token')
    }
}
// socketMiddleware @function 
// socket @params object 
// verifies the token on socket connection
function socketMiddleware(socket, next) {
    const token = socket.handshake.query['authorization'].replace('bearer ', '');
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next()
    }

    catch {
        socket.disconnect(true);
    }
}

module.exports = { middleware, socketMiddleware };