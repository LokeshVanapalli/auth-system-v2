const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const authenticationMiddleware = async (req, res, next) => {
    // console.log(req.headers)
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(StatusCodes.UNAUTHORIZED).send(`<h1 style="font-family: cursive;">Authentication failed: No token provided</h1>`)
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token,process.env.SECRET_KEY)
        req.user = {UserId: payload.UserId, name: payload.name}
        next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Authentication Invalid'})
    }
    
}

module.exports = authenticationMiddleware