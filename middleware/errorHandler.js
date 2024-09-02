const {StatusCodes} = require('http-status-codes')
const {CustomAPIError} = require('../errors/customAPI')

const errorHandlerMiddleware = (err, req, res, next)=>{
    console.log(err)

    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong',
    }
    
    // if(err.name == 'CastError'){
    //     customError.message = `There is an error in JobId: ${err.value}`
    // }
    if(err.name === 'ValidationError'){
        customError.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(',')
        customError.statusCode = 400
    }
    if(err.code && err.code === 11000){
        customError.message = `Email ${err.errorResponse.keyValue.email} already exists`,
        customError.statusCode = 400
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    return res.status(customError.statusCode).json({message: customError.message})
}

module.exports = errorHandlerMiddleware