var arr = new Array(25);
var arr2 = [];
var tmp = 0;
var bingo = [];

var doc = document;

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

function check_num(obj){
    
    number = doc.getElementById(obj.id);
    
    if(arr2[parseInt(obj.id / 5)][obj.id % 5] == 0)
        return;

    arr2[parseInt(obj.id / 5)][obj.id % 5] = 0;

    number.className += ' clicked_num';
        
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

    if((cross + row + col) == 1) gameOver();
}

function gameOver() {
    $("#result_modal").modal();
}