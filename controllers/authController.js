const User = require('../models/user')
const TokenBlacklist = require('../models/tokenBlacklist')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // to generate OTP

const register = async (req, res) => {

    // console.log('Registration request received:', req.body);
    const existingEmail = await User.findOne({email: req.body.email})
    if(existingEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: `Email ${req.body.email} already exists`})
    }
    const user = await User.create({...req.body}) 
    // const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({message: "User Created Sucessfully" , user: {user}})

    
}

const login = async (req, res) => {
    
    const { email, password, checkBox } = req.body
    // console.log(email, password, checkBox)
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide email or password'})
    }
    const user = await User.findOne({ email })
    if(!user){
        // console.log('no user')
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'No user Found'})
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Incorrect Email or Password'})
    }

    let expireTime;
    if(checkBox){
        expireTime = '30d' // 1 week
    } else {
        expireTime = '1h' // 1 hour
    }


    // compare password
    const token = user.createJWT(expireTime)
    // console.log(req.headers)
    // console.log(token)
    res.status(StatusCodes.OK).json({message: "Login Successful", user: {name: user.name}, token})
}

const home = async (req, res) => {
    // console.log(req.user)
    const {UserId, name} = req.user
    res.status(StatusCodes.OK).json({name, UserId})
}

// forget-password
let otpStore = {};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 578,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function generateOTP() {
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = Date.now() + 60 * 1000; // OTP valid for 5 minutes
    return {otp, expiresAt}
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    // Check if email is provided
    if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email' });
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({message: "Check your email or user not found"})
        }

    const {otp, expiresAt} = generateOTP();
    otpStore[email] = {otp, expiresAt};

    // Send OTP email
    try {
        await transporter.sendMail({
            from: {
                name: 'Your OTP for Password Reset',
                address: process.env.EMAIL_USER,
            },
            to: email,
            subject: 'Your OTP Code',
            text: ` We received a request to verify your identity. Please use the One-Time Password (OTP) provided below to complete the verification process:

    Your OTP Code: ${otp}
    
    This code is valid for the next 5 minutes. Please do not share this code with anyone.

    If you did not request this verification, please ignore this email.`,
        });

        res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP Route

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    // Check if OTP is correct

    if(!otpStore[email]){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Request new OTP'})
    }
    if(otpStore[email].expiresAt < Date.now()){
        delete otpStore[email];
        return res.status(StatusCodes.EXPECTATION_FAILED).json({ message: 'OTP has Expired'})
    }

    if(otpStore[email].otp !== otp){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP'})
    }

    if (otpStore[email].otp === otp) {
        delete otpStore[email];

        const token = jwt.sign({email}, process.env.SECRET_KEY, { expiresIn: '1d'})
        const resetLink = `${req.protocol}://${req.get('host')}/update.html?token=${token}`
        try {
            await transporter.sendMail({
                from: {
                    name: 'Password Recovery',
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: 'Password Reset Request',
                text: `We received a request to reset your password. To proceed, please click the link below to create a new password:

Reset Password Link : ${resetLink}

This link will expire in 5 hours, so please use it promptly. If you did not request a password reset, you can safely ignore this email.

If you encounter any issues or have questions, please contact our support team.`,
            });

            res.status(StatusCodes.OK).json({ message: 'OTP verified successfully, Check your email for Password Reset link' });
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send Reset Link' });
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'something wrong in verifyOTP' });
    }
}

const verifyResetToken = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Token is required' });
    }
    
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        const email = decode.email

        res.status(StatusCodes.OK).json({ email });
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Link is expired' });
        } else {
            console.log(error)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
    }

}

const update = async (req, res) => {
    const {password, confirmPassword, email, token} = req.body

    if(!password || !confirmPassword){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password and Confirm Password are required'})
    }

    if(password !== confirmPassword){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password and Confirm Password should be match'})
    }

    try {
        const decodeToken = jwt.verify(token, process.env.SECRET_KEY)

        const isBlacklisted = await TokenBlacklist.findOne({token})
        if(isBlacklisted){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Link has already been used or is invalid. Request new mail' })
        }
        const user = await User.findOne({email})

        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
        }

        user.password = password
        await user.save()

        const newBlacklistEntry = new TokenBlacklist({
            token,
            expiresAt: decodeToken.exp * 1000
        })
        await newBlacklistEntry.save()


        res.status(StatusCodes.OK).json({ message: "Password Updaed Sucessfully" })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Error in updating password' })
    }
}

module.exports = {
    register,
    login,
    home,
    forgetPassword,
    verifyOTP,
    update,
    verifyResetToken
}