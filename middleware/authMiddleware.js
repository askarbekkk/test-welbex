const jwt = require("jsonwebtoken")
const {secret} = require("../controllers/config")


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.json(403).json({message: "user is not authorized!"})
        }
        req.user = jwt.verify(token, secret)

        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "User is not authorized"})

    }
}