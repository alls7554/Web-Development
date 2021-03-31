var doc = document;

var arr = new Array(25);
var arr2 = [];
var tmp = 0;
var bingo = [];

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

function check_num(user_name, obj){

    if(arr2[parseInt(obj.id / 5)][obj.id % 5] == 0)
        return;
    
    $("#chat_list").append("<li class='list-group-item list-group-item-warning'><span>System : "+ user_name + "님이 " + obj.innerText +"을(를) 선택하셨습니다.</span></li>");
    
    arr2[parseInt(obj.id / 5)][obj.id % 5] = 0;

    obj.className += ' clicked_num';
        
    BlackBingo();
}    

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
        bingoRoom.emit('GAMEOVER');
        gameOver();  
    } 
}

function gameOver() {
    
    let myBingoCount = doc.getElementById("bingoCount").innerText;
    
    if(myBingoCount >= 1)
        doc.getElementById("result").innerHTML = "WIN";
    else
        doc.getElementById("result").innerHTML = "LOSE";
        
    $("#result_modal").modal();
}
// Bingo 영역 종료