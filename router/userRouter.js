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

const { nanoid } = require('nanoid')

router.get('/',(req,res)=>{
    res.send('eu funfo!')
})
router.post('/post',(req,res) => {
    let id = nanoid()
    let nome = req.query.nome
    let email = req.query.email
    let senha = req.query.senha
    let niver = req.query.niver
    let genero = req.query.genero
    mysqlconnect.query(`insert into usuarios (id,nome,email,senha,niver,genero) values (?,?,?,?,?,?)`,[id,nome,email,senha,niver,genero],
    (err,rows,fields) => {
        if(!err)
        res.send({linhas:rows,status:'ok',id:id})
        else
        res.send({erro:err,status:'falha'})
    })
})
router.get('/login',(req,res) => {
    //res.send(req.query)
    let email = req.query.email
    let senha = req.query.senha
    mysqlconnect.query(`select * from usuarios where email = ?`,[email],(err,rows,fields) => {
        if(!err && rows.length > 0){
            console.log(rows);
            let linha = rows[0]
            if(linha.senha === senha){
                delete rows[0].senha
                res.send({linhas:rows,status: 'ok'})
            } else{
                res.send({erro:'Senha incorreta',status: 'falha'}) 
            }
        }
        else{
            res.send({erro:'Usuário não encontrado',status: 'falha'})
        }
        
    })
})

module.exports = router;