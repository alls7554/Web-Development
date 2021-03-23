const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

const socket = require('socket.io');
const io = socket(server);

const port = 3000
var socketList = [];    // 접속한 유저들의 소켓을 소지할 배열

var router = require('./router/main') (app);

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// server에 연결 중
io.on('connection', function(socket){
    socketList.push(socket);
    console.log("User join");
    
    // server와 연결 해제
    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
        console.log("User disconnected");
    });

    // message 발송 시 server에서 받음
    socket.on('SEND', function(user_name, msg){
        console.log(user_name + " : " + msg);
        socketList.forEach(function(item, i) {
            if(item != socket){
                // 본인을 제외한 다른 사람들에게 message 전송
                item.emit('SEND', user_name, msg);
            }
        });
    });

    // 빙고 숫자 클릭 server에서 받음
    socket.on('CLICK', function(user_name, number){
        console.log(user_name + " choose " + number);
        socketList.forEach(function(item, i) {
            if(item != socket){
                // 본인을 제외한 다른 사람들에게 빙고 숫자 전송
                item.emit('CLICK', user_name, number);
            }
        });
    });

    // 게임 종료
    socket.on('GAMEOVER', function(){
        socketList.forEach(function(item, i) {
            if(item != socket){
                // 게임 종료 전송
                item.emit('GAMEOVER');
            }
        });
    });
});

server.listen(port, function(){
    console.log(`Express server has started on port ${port}`);
});
