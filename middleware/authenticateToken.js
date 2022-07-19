const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // console.log(req.cookies);
    // console.log("TOKEN " + String(req.cookies.TOKEN_PAYLOAD) + "." + String(TOKEN_SIGNATURE));
    var payload = req.cookies.TOKEN_PAYLOAD;
    var signature = req.cookies.TOKEN_SIGNATURE;
    // console.log("payload " + payload);
    // console.log("signature " + signature);

    // const authHeader = req.headers.authorization;
    const authHeader = payload + "." + signature;
    // console.log("your authheader " + authHeader);

    if(!authHeader) {
        var err = new Error("Unauthorized");
        err.status = 401;
        return next(err);
    }

    // var token = authHeader.split(' ')[1];
    var token = authHeader;

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if(error) {
            var err = new Error("Unauthorized");
            err.status = 401;
            return next(err);
        }

        // console.log(decoded);

        next();
    });
}

module.exports = {
    authenticateToken
}