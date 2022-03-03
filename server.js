const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

app.use(express.static('public'))

let data = JSON.parse(fs.readFileSync('data.json','utf-8'))

var path = require('path')



// lokasi folder views
app.set('views', path.join(__dirname, 'views'))
//set view engine ejs   
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('list',{ data })      //render data.json pada list.ejs                 
})

app.get('/add', function(req, res){
    const page = req.query.page
    res.render('add')
})

app.post('/add', function(req, res){
    let taskstring = req.body.string
    let taskinteger = req.body.integer
    let taskfloat = req.body.float
    let taskdate = req.body.date
    let taskboolean = req.body.boolean
    
    let todo = {
        string: taskstring,
        integer: taskinteger,
        float: taskfloat,
        date: taskdate,
        boolean: taskboolean
    }

    data.push(todo)
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3), 'utf-8')
    res.redirect('/')
})

app.get('/delete/:id', function(req, res){
    const id = req.params.id
    data.splice(id,1)
    res.redirect('/')
})

app.get('/edit/:id', function(req,res){
    const id = req.params.id
    // console.log(data[id])
    res.render('edit', {data: data[id]})
})

app.post('/edit/:id', function(req, res){
    const id = req.params.id
    data[id].string = req.body.string
    data[id].integer = req.body.integer
    data[id].float = req.body.float
    data[id].date = req.body.date
    data[id].boolean = JSON.parse(req.body.boolean)
    
    //data[id].complete = JSON.parse(req.body.complete)
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3), 'utf-8')
    res.redirect('/')
})



app.listen(3000, function(){
    console.log('web berjalan di port 3000')
})