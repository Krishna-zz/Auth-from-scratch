const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const connectdb = require('./Config/db')
const router = require('./Routes/auth')


dotenv.config()
connectdb()

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())


app.use('/user', router)



app.listen(3000)