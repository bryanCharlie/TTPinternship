var express = require('express');
var app = express();
var bodyParser = require('body-parser'),
    pg = require('pg'),
    connectionString = 'postgres://' + 'postgres' + ':' +
    process.env.POSTGRES_PASSWORD + '@localhost/db'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
})

app.get('/projects', function(req, res) {
    res.render('projects');
})

app.get('/contact', function(req, res) {
    res.render('contact');
})

app.get('/blog', function(req, res) {
    res.redirect('/blog/bryan');
})

app.get('/blog/bryan', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`select * from posts where user_id = 1`, function(err, result) {
            res.render('blog', {
                data: result.rows
            })
            done();
            pg.end();
        })
    })
})

app.get('/blog/bryan/posts/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`select * from posts where id = '${req.params.id}'`, function(err, result) {
            res.render("post", {
                data: result.rows
            })
            done()
            pg.end()
        })
    })
})

app.post('/blog/bryan/posts/create', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`insert into posts (post_name, post_body, user_id) values ('${req.body.title}', '${req.body.body}', 1)`,
            function(err, result) {
                done();
                pg.end();
                res.redirect('/blog/bryan');

            })
    })
})

app.listen(8000, function() {
    console.log('listening on port');
})
