var http = require('http');
var fs = require('fs');
var path = require('path');
var myPath = path.dirname(__filename);
var rootPath = path.normalize(myPath + "/..")
var _url = path.normalize(rootPath + "/pages/index.html")

var app = http.createServer(function (request, response) {

  var url = request.url;
  var a = url.split('/');
  // var isRootDir = false;

  if (a.length > 1 && a[1] != '') {
    // console.log(a[1]);
    //a[1] 나오는경우 1 기본 경로 / + 나온문자 (css ,js ,etc) 
    //a[1] 나오는경우 2 favicon.ico // index.html 
    var exe = a[1].split('.');

    console.log('파일 확장자가 있나? ' + exe, exe.length, exe);
    if (exe.length > 1) {

      if (exe[0] == 'favicon') {
        url = 404
      } else {
        url = rootPath + "/pages/" + url;
        // url = path.normalize(rootPath + "/pages/" + url)
        console.log(url)
      }

    } else {
      //url = 404
      url = rootPath + "/" + exe + "/" + a[2];
      // url = path.normalize(rootPath + "/" + exe + "/" + a[2])
      console.log(url)
    }

  } else {
    url = _url;
  }

  if (url == 404) {
    response.writeHead(404);
    response.end();
    return;
  }
  // console.log(url)
  response.writeHead(200);
  response.end(fs.readFileSync(url));
});

app.listen(3000);