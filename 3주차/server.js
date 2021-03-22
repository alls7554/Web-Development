const express = require('express')

const app = express()
const port = 3000

var router = require('./router/main') (app);

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log(`Express server has started on port ${port}`)
});
