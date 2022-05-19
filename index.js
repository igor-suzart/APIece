const express = require('express')
const app = express()
require("dotenv").config({
    allowEmptyValues: true
})
app.use(express.json())
const cors = require('cors')
var corsOptions = {
    origin: 'http://localhost:8100',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
var userRouter = require('./router/userRouter')
var feedRouter = require('./router/feedRouter')

app.get('/',(req,res) => {
    res.send({pudim:'amassado'})
})
app.use('/user',userRouter)
app.use('/feed',feedRouter)

app.listen(process.env.port, () => {
    console.log(`run APIece on http://localhost:${process.env.port}`);
})