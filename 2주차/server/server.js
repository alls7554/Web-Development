var http = require('http');
var fs = require('fs');
var path = require('path');

var myPath = path.dirname(__filename);
var rootPath = path.normalize(myPath + "/..")
var _url = path.normalize(rootPath + "/pages/index.html")

var app = http.createServer(function (request, response) {

    // 지정된 외 입력 방지를 위한 정규식
    var excep_Re = new RegExp('(js|css)$');

    var url = request.url;
    var split_url = url.split('/');
    
    //url을 '/'을 기준으로 분리하였을 때, '' 나오는 경우와 그렇지 않은 경우가 있다.
    //a[1]에 ''가 나오는경우      1 index.html 
    //a[1]에 ''가 나오지않는 경우 2 기본 경로 / + 나온문자 (css ,js ,etc) 
    if (split_url[1] != '') {
        console.log(split_url)
        var htmlEx = new RegExp('.*\.html$');
        
        // 확장자명이 html인 경우
        if (htmlEx.test(split_url[1])) {
            url = rootPath + "/pages/" + url;
        } else if(excep_Re.test(split_url[1])){
            url = rootPath + url;
        } else {
          url = rootPath+'/pages/404.html';
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
    
    response.writeHead(200);
    response.end(fs.readFileSync(url));
});

app.listen(3000);