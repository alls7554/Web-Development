const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;

const room = [];
const roomStatus = {
    waiting : 0,
    playing : 1,
    over : 2
}

let UnEnterable = true;

var router = require('./router/main') (app);

app.use(express.static('public'));

// server에 연결 중
const bingoRoom = io.of('/bingo').on('connection', function(socket){
    console.log("User join");

    let user_cookie = socket.handshake.headers.cookie;
    let splitCookie = user_cookie.split('=');

    const name = splitCookie[0];

    if(UnEnterable) {
        let log = {
            roomStatus : 0,
            msg : [],
            play_log : [],
            user : [],
            time_log : {
                createTime : '',
                startTime : '',
                overTime : '',
                extinctTime : ''
            }
        };

        log.time_log.createTime = new Date();
        room[room.length] = log;
        log.user.push(name);
        socket.join(room[room.length-1]);
        bingoRoom.to(room[room.length-1]).emit('whosEnter', name, room.length-1);
        UnEnterable = false;
        console.log(room);

        console.log(socket.id)
    } else {
        for(let i=0; i<room.length; i++){
            if(room[i].roomStatus == 0){
                room[i].user.push(name);
                socket.join(room[i]);
                bingoRoom.to(room[i]).emit('whosEnter', name, i);
                console.log(socket.id)
                console.log(io.of('/bingo'))
                if(room[i].user.length == 4){
                    room[i].roomStatus = 1;
                    console.log('gamestart')
                    bingoRoom.to(room[i]).emit('GameStart');
                    UnEnterable = true;
                }
                return;
            }
        }
    }


    // server와 연결 해제
    socket.on('disconnect', function() {
        // socketList.splice(socketList.indexOf(socket), 1);
        console.log("User disconnected");
    });

    // message 발송 시 server에서 받음
    socket.on('SEND', function(data){
        console.log('send ready')
        let user_name = data.user_name,
            msg = data.msg,
            idx = data.roomIdx;

        room[idx].msg.push({user_name, msg})
        socket.broadcast.to(room[idx]).emit('SEND', user_name, msg);
    });

    // 빙고 숫자 클릭 server에서 받음
    socket.on('CLICK', function(user_name, number){
        console.log(user_name + " choose " + number);
        
    });

    // 게임 종료
    socket.on('GAMEOVER', function(){
        
    });
});

server.listen(port, function(){
    console.log(`Express server has started on port ${port}`);
});
