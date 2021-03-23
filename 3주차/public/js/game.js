var socket = io();

var arr = new Array(25);
var arr2 = [];
var tmp = 0;
var bingo = [];

var doc = document;

// 새로고침 방지(f5, ctrl+f5, ctrl+r)
$(document).keydown(function (e) {
     
    if (e.which === 116) {
        if (typeof e == "object") {
            e.keyCode = 0;
        }
        return false;
    } else if (e.which === 82 && e.ctrlKey) {
        return false;
    }
}); 

window.onload = function() {

    for (let i = 0; i < arr.length; i++) {
        arr[i] = i + 1;
    }

    arr.sort(function () { return 0.5 - Math.random() });

    for (let i = 0; i < arr.length; i++) {
        bingo[i % 5] = arr[i];    //01234/01234/01234/01234/01234
        if ((i + 1) % 5 == 0) {
            arr2[tmp] = bingo;
            tmp++;
            bingo = [];
        }
    }

    var output = "";

    for (var i = 0; i < arr.length; i++) {

        output = "";

        output += arr[i];

        doc.getElementById(i).innerHTML = output;
    }

    doc.getElementById("msg").focus();
}

function check_num(user_name, obj){

    if(arr2[parseInt(obj.id / 5)][obj.id % 5] == 0)
        return;
    
    $("#chat_list").append("<li class='list-group-item list-group-item-success'><span>"+ user_name + "님이 " + obj.innerText +"을(를) 선택하셨습니다.</span></li>");
    
    socket.emit('CLICK', user_name, obj.innerText);
    

    console.log(obj.id)
    arr2[parseInt(obj.id / 5)][obj.id % 5] = 0;

    obj.className += ' clicked_num';
        
    BlackBingo();
}

socket.on('CLICK', function(user_name, number) {
    for(let i=0; i<arr.length; i++){
        if(number == arr[i]) {
                        
            $("#chat_list").append("<li class='list-group-item list-group-item-success'><span>"+ user_name + "님이 " + number +"을(를) 선택하셨습니다.</span></li>");
            console.log(arr2[parseInt(i / 5)][i % 5]);
            arr2[parseInt(i / 5)][i % 5] = 0;
            let test = document.getElementById(i)
            test.className += ' clicked_num';
        
            BlackBingo();
            return;
        }
    }
})
    

function BlackBingo() {
    var row = 0;
    var col = 0;
    var cross = 0;
    
    // 가로 빙고 검사
    for (let i = 0; i < arr2.length; i++) {
        var check = false;
        for (let j = 0; j < arr2[i].length; j++) {
            if (arr2[i][j] == 0) {
                check = true;
            } else {
                check = false;
                break;
            }
        }
        if (check) row++;    //빙고 카운트
    }

    // 세로 빙고 검사
    for (let i = 0; i < arr2[0].length; i++) {
        var check = false;
        for (var j = 0; j < arr2[i].length; j++) {
            if (arr2[j][i] == 0) {
                check = true;
            } else {
                check = false;
                break;
            }
        }
        if (check) col++;  //빙고 카운트 
    }

    // 대각선 빙고 검사
    var right = 0;
    var left = 0;

    for (i = 0; i < arr2[0].length; i++) {
        if (arr2[i][i] == 0) right++; // 오른대각
        if (arr2[arr2.length - i - 1][i] == 0) left++;  // 왼대각
        if (right == 5 || left == 5) cross++;
    }
    if (right == 5 && left == 5) cross++;

    doc.getElementById('bingoCount').innerHTML = (cross + row + col);

    if((cross + row + col) == 1){
        socket.emit('GAMEOVER');
        gameOver();  
    } 
}

socket.on('GAMEOVER', function(){
    gameOver();
});

function gameOver() {
    
    let myBingoCount = doc.getElementById("bingoCount").innerText;
    
    if(myBingoCount >= 1)
        doc.getElementById("result").innerHTML = "WIN";
    else
        doc.getElementById("result").innerHTML = "LOSE";
        
    $("#result_modal").modal();
}
// Bingo 영역 종료

// Chatting 영역 시작
$(document).on('keydown', 'div.publisher input', function(e){
    if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        
        let user_name = document.getElementById('my_name').innerText;
        
        // 메시지 전송
        sendMessage(user_name);
        // 입력창 clear
        clearMsg();
        
    }
});

// 다른 사람이 메시지 전송시 받기
socket.on('SEND', function(user_name, msg){
    $("#chat_list").append("<li class='list-group-item list-group-item-success'><span>"+ user_name + " : " + msg +"</span></li>");
})

// 메시지 전송
function sendMessage(user_name) {
    var msg = $("#msg").val();
    
    if(msg == "") return;

    socket.emit('SEND', user_name, msg);

    $("#chat_list").append("<li class='list-group-item list-group-item-success me'><span>" + user_name + "(나) : " + msg +"</span></li>");
    
    // 스크롤바 아래 고정
    $('div.chat_log').scrollTop($('div.chat_log').prop('scrollHeight'));
    clearMsg();
}

// 메시지 입력창 초기화
function clearMsg(){
    $("#msg").val("");
}