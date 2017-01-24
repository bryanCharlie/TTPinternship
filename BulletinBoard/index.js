var pg = require('pg')
var app = require('express')()
var bodyParser = require('body-parser')
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/messages', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('select * from messages', function(err, result) {
            res.render("home-page", {
                data: result.rows
            })
            done()
            pg.end()
        })
    })
})

app.get('/', function(req, res) {
    res.redirect('/messages')
})

app.post('/messages/create', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`insert into messages (title, body) values ('${req.body.title}', '${req.body.body}')`, function(err, result) {
            console.log(err)
            done()
            pg.end()
            res.redirect('/messages')
        })
    })
})

app.get('/messages/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`select * from messages where id = '${req.params.id}'`, function(err, result) {
            res.render("message-page", {
                data: result.rows
            })
            done()
            pg.end()
        })
    })
})

app.listen(8000, function() {
    console.log("listening on port")
})
