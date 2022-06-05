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
const res = require('express/lib/response')
const { nanoid } = require('nanoid')
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
router.post('/acao',(req,res) => {
    var idNoticia = req.query.idNot
    var idUser = req.query.idUser
    var like = req.query.like
    var dislike = req.query.dislike
    var comentario = req.query.comentario
    var idComentario = null
    var naoVerificada= req.query.naoVerificada
    if(comentario){
      idComentario = nanoid()
    }
    //if(dislike && !like)
    mysqlconnect.query(`insert into acoesfeed (idNot,idUser,curtida,dislike,comentario,idComentario,naoVerificada) values (?,?,?,?,?,?,?)`,[idNoticia,idUser,like,dislike,comentario,idComentario,naoVerificada],(err,rows,fields) => {
        if(!err){
            res.send({linhas: rows,status: 'ok'})
        } else{
            res.send({erro:err,status:'falha'})
        }
    })
})
router.get('/getAcao',(req,res) => {
    var idNoticia = req.query.idNot
    var idUser = req.query.idUser
    mysqlconnect.query(`select * from acoesfeed where idNot = ? and idUser = ?`,[idNoticia,idUser],(err,rows,fields) => {
        if(err)
        res.send({erro:err,status:'falha'})
        else
        res.send({linhas:rows,status:'ok'})
    })
})
router.get('/getAcaoNaoVeri',(req,res) => {
    var idNoticia = req.query.idNot
    var idUser = req.query.idUser
    mysqlconnect.query(`select * from acoesfeed where idNot = ? and naoVerificada = 1`,[idNoticia],(err,rows,fields) => {
        if(err)
        res.send({erro:err,status:'falha'})
        else
        res.send({linhas:rows,status:'ok'})
    })
})
router.get('/getNotComents',(req,res) =>{
    var idNot = req.query.idNot
    var limit = req.query.limit
    mysqlconnect.query(`select * from acoesfeed where idNot = ? and comentario is not null limit ${limit}`,[idNot],(err,rows,fields) => {
        if(err)
        res.send({erro:err,status:'falha'})
        else
        res.send({linhas:rows,status:'ok'})
    })
})
router.post('/postNoticia',(req,res) => {
  let dados = JSON.parse(req.query.data)
  let id = nanoid()
  mysqlconnect.query(`insert into noticias (title,url,description,image,sourceUrl,name,id) values (?,?,?,?,?,?,?)`,
[dados.title,dados.url,dados.description,dados.image,dados.sourceUrl,dados.name,id],
(err,rows,fields) => {
  if(err)
  res.send({erro:err,status:'falha'})
  else
  res.send({linhas:rows,status: 'ok'})
})
})
router.get('/getNotPubli',(req,res) => {
  let page = req.query.page
  mysqlconnect.query(`select * from noticias`,(err,rows,fields) => {
    if(err)
    res.send({erro:err,status:'falha'})
    else
    res.send({articles:rows,status: 'ok'})
  })
})
module.exports = router;
