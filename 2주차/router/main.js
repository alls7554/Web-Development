module.exports = function(app)
{
    // 메인화면 불러오기 
    app.get('/', function(req, res){
        res.render('index.html')
    });

    // 게임화면 불러오기
    app.get('/game.html', function(req, res){
        res.render('game.html')
    });

    app.use(function(err, req, res, next){
        console.log(err.stack);
        res.status(404).render('404.html');
    })
}

