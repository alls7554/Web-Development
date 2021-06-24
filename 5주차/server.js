const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require('path');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require("express-session");
const { saveLog, saveGame, loadTable, updateGame, loadGame } = require("./DataBase/redis");
const { now } = require("./public/js/korDate");
const { load } = require('./DataBase/mongoDB');
const logger = require('morgan');
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const mainRouter = require('./router/main');
app.use('/', mainRouter);

app.use(
      session({
        secret: 'asdasdasd',
        resave: false,
        saveUninitialized: true,
      })
    );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = 3000;

const room = [];
const firstRoomName = "game-";
    
let log = {
  array : [],
  roomStatus: 0,
  turnIdx: 0,
  msg: [],
  play_log: [],
  user: [],
  time_log: []
};
temp = deepCopy(log);
room[0] = temp; //서버가 열렸을 때, 방을 미리 만들기 위함

let sessionList = [];

// server에 연결 중
let bingoRoom = io.of('/bingo').on('connection', async (socket) => {
  console.log('User join');
  let user_cookie = socket.handshake.headers.cookie;
  let cookieArrayTemp = user_cookie.split(';');
  let cookieArray = [];
  for (row in cookieArrayTemp) {
    let data = cookieArrayTemp[row].replace(/ /g, "");
    let temp = data.split('=');
    cookieArray[temp[0]] = temp[1];
  }
  let id = socket.id;
  let name = cookieArray['id'];
  const sessionIdx = cookieArray['connect.sid'];

  let roomName = firstRoomName + (room.length - 1);

  bingoRoom.to(socket.id).emit('IMENTER', name);

  if(sessionList[sessionIdx]) {
    let splitRoom = sessionList[sessionIdx].roomName.split('-');
    let roomIdx = splitRoom[1];
  
    if(room[roomIdx].roomStatus == 1){
      let arr = await loadTable(sessionIdx);
      let arr2 = await loadGame(sessionIdx);
      
      for(let i = 0, tmp = 0; i<room[roomIdx].array.length; i++){
        if(room[roomIdx].array[i] == 0){
          tmp = i;
          for(let j = 0; j < arr.length; j++){
            if (arr[j] == tmp)
              arr2[parseInt(j/5)][j%5] = 0;
          }
        }
      }
      roomName = firstRoomName + roomIdx;
      bingoRoom.to(socket.id).emit('REENTER', arr, arr2, sessionList[sessionIdx].roomName);
      bingoRoom.to(roomName).emit('TURNCHANGE', room[roomIdx].user[room[roomIdx].turnIdx].name);
    }
  } else {
    sessionList[sessionIdx] = {roomName, name};
  }
  let roomIdx = roomName.split('-');
  socket.join(roomName);
  room[roomIdx[1]].user.push({name, id});
  bingoRoom.to(roomName).emit('WHOSENTER', name, roomName, socket.adapter.rooms.get(roomName).size);
  if(room[roomIdx[1]].user.length == 1){
    room[roomIdx[1]].time_log.push(('createTime:'+now()));
  }else if (room[roomIdx[1]].roomStatus != 1 && socket.adapter.rooms.get(roomName).size == 2){
    room[roomIdx[1]].roomStatus = 1;
    room[roomIdx[1]].time_log.push(('startTime:'+now()));
    bingoRoom.to(roomName).emit('GAMESTART', room[roomIdx[1]].user[0].name);
    bingoRoom.to(room[roomIdx[1]].user[room[roomIdx[1]].turnIdx].id).emit('URTURN');
    room[room.length-1].array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
    temp = deepCopy(log);
    room[room.length] = temp;
  }

  socket.on('GAMESTART', (arr, arr2) => {
    console.log('GAME START! '+ now());
    saveGame({ sessionIdx, arr, arr2 });
    console.log(room)
  });

  // message 발송 시 server에서 받음
  socket.on('SEND', (data) => {
    let user_name = data.user_name,
        msg = data.msg,
        idx = data.roomIdx,
        room_idx = idx.split('-');

    room[room_idx[1]].msg.push({ user_name, msg });
    socket.broadcast.to(idx).emit('RECEIVED', user_name, msg);
  });

  // 빙고 숫자 클릭 server에서 받음
  socket.on('CLICK', (data) => {

    let roomName = data.roomIdx,
        user_name = data.user_name,
        number = data.num,
        split_Idx = roomName.split('-'),
        room_Idx = split_Idx[1];

    room[room_Idx].turnIdx += 1;
    room[room_Idx].array[number] = 0;

    if (room[room_Idx].turnIdx >= room[room_Idx].user.length)
      room[room_Idx].turnIdx = 0;

    room[room_Idx].play_log.push({ user_name, number });

    socket.broadcast.to(roomName).emit('CLICK', user_name, number);
    bingoRoom.to(roomName).emit('TURNCHANGE', room[room_Idx].user[room[room_Idx].turnIdx].name);
    bingoRoom.to(room[room_Idx].user[room[room_Idx].turnIdx].id).emit('URTURN');
  });

  socket.on('UPDATE', (arr) => {
    updateGame({ sessionIdx, arr });
  })
  // 게임 종료
  socket.on('GAMEOVER', (roomIdx) => {
    let room_idx = roomIdx.split('-');
    room[room_idx[1]].time_log.push(('overTime:'+now()));
    room[room_idx[1]].roomStatus = 2;

    bingoRoom.to(roomIdx).emit('GAMEOVER');
  });

  // server와 연결 해제
  // socket.on('disconnect', () => {
  //   let roomidx = 0;
  //   // items는 각 room의 정보에 해당
  //   room.forEach((items) => {
  //     if (items.roomStatus != 2) {
  //       // item은 각 room의 user에 해당
  //       items.user.forEach((item) => {
  //         if (item.id == socket.id) {
  //           let idx = 0;  // userIdx
  //           if(items.roomStatus == 1) {
  //             if(idx == items.turnIdx){
  //               if(items.user.length == 1) return;
  //               items.turnIdx += 1;
  //               // bingoRoom.to(firstRoomName + roomidx).emit('TURNCHANGE', items.user[idx+1].name);
  //               bingoRoom.to(items.user[idx+1].id).emit('URTURN');
  //             } else if(idx < items.turnIdx){
  //               items.turnIdx -= 1;

  //               // bingoRoom.to(firstRoomName + roomidx).emit('TURNCHANGE', item.name);
  //             }
  //             bingoRoom.to(firstRoomName+roomidx).emit('TURNCHANGE', items.user[items.turnIdx].name);
  //           }
  //           items.user.splice(items.user.indexOf(item), 1);
  //           bingoRoom.to(firstRoomName + roomidx).emit('WHOSLEAVE', item.name, firstRoomName + roomidx, items.user.length);
  //           socket.leave(firstRoomName + roomidx);
  //           if(items.turnIdx >= items.user.length) items.turnIdx = 0;
  //           console.log(room)
  //           idx += 1;
  //         }  
  //       });
  //     } else if (items.roomStatus == 2 && !socket.adapter.rooms.get(roomName)) {
  //       items.time_log.push(('extinctTime:'+now()));
  //       saveLog(items);
  //       items.splice(items.indexOf(items), 1);
  //     }
  //     roomidx += 1;
  //   });
  //   console.log("User disconnected");
  // });
  socket.on('disconnect', () => {
    let roomIdx = 0;
  
    room.forEach((items) => {
      if(items.roomStatus != 2){
        let idx = 0;
        items.user.forEach((item) => {
          if(item.id == socket.id){
            if(items.roomStatus == 1){
              if(idx == items.turnIdx){
                if(items.user.length > 1){
                  items.turnIdx += 1;
                  bingoRoom.to(items.user[items.turnIdx].id).emit('URTURN');
                }
              } else if(idx < items.turnIdx){
                items.turnIdx -= 1;
              }
              bingoRoom.to(firstRoomName+roomIdx).emit('TURNCHANGE', items.user[items.turnIdx].name);
            }
            items.user.splice(items.user.indexOf(item), 1);
            if (items.turnIdx >= items.user.length){
              items.turnIdx = 0;
            } 
            bingoRoom.to(firstRoomName + roomIdx).emit('WHOSLEAVE', item.name, firstRoomName + roomIdx, items.user.length);
            socket.leave(firstRoomName + roomIdx);
          }
          idx += 1;
  
        });
      }
    });
    console.log("User disconnected");
  });
});

server.listen(port, function () {
  console.log(`Express server has started on port ${port}`);
});

function deepCopy(obj) {
  if (Array.isArray(obj)) return new Array();

  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let copy = [];
  for (let key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
}
