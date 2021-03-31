const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;

const room = [];
const firstRoomName = 'game';
const roomStatus = {
    waiting : 0,
    playing : 1,
    over : 2
}

let UnEnterable = true;

var router = require('./router/main') (app);

app.use(express.static('public'));

// server에 연결 중
var bingoRoom = io.of('/bingo').on('connection', function(socket){
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

        let roomName = firstRoomName+room.length;

        log.time_log.createTime = new Date();
        log.user.push(name);
        room[room.length] = log;
        socket.join(roomName);
        bingoRoom.to(roomName).emit('whosEnter', name, roomName);
        UnEnterable = false;
        
        console.log(socket.adapter.rooms)
        console.log(room)
    } else {
        for(let i=0; i<room.length; i++){
            if(room[i].roomStatus == 0){
                room[i].user.push(name);
                socket.join(firstRoomName+i);
                bingoRoom.to(firstRoomName+i).emit('whosEnter', name, firstRoomName+i);
                console.log(socket.adapter.rooms)

                if(room[i].user.length == 4){
                    room[i].roomStatus = 1;
                    console.log(' gamestart')
                    console.log(room[i].user)
                    bingoRoom.to("game"+i).emit('GameStart');
                    UnEnterable = true;
                }
            }
        }
    };


    // server와 연결 해제
    socket.on('disconnect', function() {
        // socketList.splice(socketList.indexOf(socket), 1);
        room.splice();
        console.log("User disconnected");
    });

    // message 발송 시 server에서 받음
    socket.on('send', function(data){
        console.log('send ready', data)
        let user_name = data.user_name,
            msg = data.msg,
            idx = data.roomIdx;

        room[0].msg.push({user_name, msg})
        console.log(idx);
        socket.broadcast.to(idx).emit('received', user_name, msg);
    });

    // 빙고 숫자 클릭 server에서 받음
    socket.on('CLICK', function(data){
        let idx = data.roomIdx,
            user_name = data.user_name,
            number = data.num;

        console.log(user_name + " choose " + number);
        socket.to(idx).emit('CLICK', user_name, number);
    });

    // 게임 종료
    socket.on('GAMEOVER', function(){
        
    });
});

server.listen(port, function(){
    console.log(`Express server has started on port ${port}`);
});
