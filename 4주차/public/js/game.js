const doc = document;
const goal = 1;
let arr = new Array(25);
let arr2 = [];
let tmp = 0;
let bingo = [];
let row = 0,
    col = 0,
    cross = 0;

window.addEventListener('DOMContentLoaded', function(){
    const nickname = getCookie();
    
    if(nickname == ""){
        alert("Nickname이 없으므로 초기화면으로 돌아갑니다.")
        location.href = './';
    } 
    doc.getElementById('my_name').innerHTML = nickname;
}); 

function makeBingo(){
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

    let output = "";

    for (var i = 0; i < arr.length; i++) {

        output = "";
        output += arr[i];
        doc.getElementById(i).innerHTML += output;
    }
}

function check_num(user_name, id, num, roomIdx){
    
    console.log(roomIdx)

    if(arr2[parseInt(id / 5)][id % 5] == 0)
        return;
    
    $("#chat_list").append("<li class='list-group-item list-group-item-warning'><span>System : "+ user_name + "님이 " + num +"을(를) 선택하셨습니다.</span></li>");
    // 스크롤바 아래 고정
    $('div.chat_log').scrollTop($('div.chat_log').prop('scrollHeight'));
    arr2[parseInt(id / 5)][id % 5] = 0;

    let clickedNum = doc.getElementById(id);

    clickedNum.className += ' clicked_num';
        
    BlackBingo(roomIdx);
}    

function BlackBingo(roomIdx) {
    
    // 가로 빙고 검사
    for (let i = 0; i < arr2.length; i++) {
        let check = false;
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
        let check = false;
        for (let j = 0; j < arr2[i].length; j++) {
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
    let right = 0;
    let left = 0;

    for (i = 0; i < arr2[0].length; i++) {
        if (arr2[i][i] == 0) right++; // 오른대각
        if (arr2[arr2.length - i - 1][i] == 0) left++;  // 왼대각
        if (right == 5 || left == 5) cross++;
    }
    if (right == 5 && left == 5) cross++;

    doc.getElementById('bingoCount').innerHTML = cross+row+col;

    if((cross + row + col) == goal){
        bingoRoom.emit('GAMEOVER', roomIdx);
    } 
}

function gameOver() {
    
    let myBingoCount = doc.getElementById("bingoCount").innerText;
    
    if(myBingoCount >= goal)
        doc.getElementById("result").innerHTML = "WIN";
    else
        doc.getElementById("result").innerHTML = "LOSE";

    $("#result_modal").modal();
}
// Bingo 영역 종료