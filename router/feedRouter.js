var gnews = 'https://gnews.io/api/v4/'
const fetch = require('node-fetch')
const mysql = require('mysql')
require("dotenv").config({
    allowEmptyValues: true
})
var mysqlconnect = mysql.createConnection({
    host: process.env.HOST,
    user:  process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    multipleStatements: true
})

var exp = require('express')
var router = exp.Router()

router.get('/',(req,res)=>{
    res.send('eu funfo!')
})

router.get('/feed',async (req,res)=>{
    gnews+=  `top-headlines?breaking-news=${req.query.topic}&token=${process.env.gnews}&lang=pt&country=br&max=12`
    const result = await fetch(gnews, {
        method: 'GET',
        mode: 'cors'
    }).then(res => res.json())
    // req.query.page = 1
    // vaproapp = result.slice(0,20)
    console.log(result);
    res.send(result)
})

module.exports = router;