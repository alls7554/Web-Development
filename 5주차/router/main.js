const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.html');
});

router.get('/game', (req, res) => {
  res.render('game.html');
});


// module.exports = function (app) {
//   app.use(
//     session({
//       secret: 'asdasdasd',
//       resave: false,
//       saveUninitialized: true,
//     })
//   );

//   // 메인화면 불러오기
//   app.get("/", function (req, res) {
//     res.sendFile(myPath + "/views/index.html");
//   });

//   // 게임화면 불러오기
//   app.get("/game", function (req, res) {
//     res.sendFile(myPath + "/views/game.html");
//   });

//   // js, css 파일 불러오기
//   app.get(new RegExp("(js|css)$"), function (req, res) {
//     url = myPath + "/public" + req.url;
//     type = mime.lookup(url);
//     if (!res.getHeader("content-type")) {
//       var charset = mime.charsets.lookup(type);
//       res.setHeader(
//         "Content-Type",
//         type + (charset ? "; charset=" + charset : "")
//       );
//     }
//     res.writeHead(200);
//     res.end(fs.readFileSync(url));
//   });

//   // 404 Error 발생 시
//   app.use(function (req, res, next) {
//     res.status(404).sendFile(myPath + "/views/404.html");
//   });
// };

module.exports = router;