require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//extra security middleware 
const cors = require('cors')

app.use(express.static('./public'))

//connect DB

const connectDB = require('./db/connect')

//routes
const authRouter = require('./routes/authRouter')
const homeRouter = require('./routes/homeRouter')
const authenticateUser = require('./middleware/authentication')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = require('./middleware/errorHandler')

app.use(express.json())
app.use(cors())


//routes
app.use('/api/v2/auth', authRouter)
app.use('/api/v2/home', authenticateUser, homeRouter)
app.use((req, res, next) => {
    res.status(404).send(`<h1 style="font-family: cursive";>404 - Page Not Found</h1>`);
    });

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()