var arr = new Array(25);
var arr2 = [];
var tmp = 0;
var bingo = [];

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

    for (let i = 0; i < arr.length; i++) {

        output = "";

        output += arr[i];

        document.getElementById(i + 1).innerHTML = output;
    }
}

function Bingo(obj) {

    console.log("클릭한 번호"+obj.innerHTML);

    var number = document.getElementById(obj.id);

    //temp code
    console.log(parseInt(obj.id/5)+", "+(parseInt(obj.id%6)-1));
    
    arr2[parseInt(obj.id / 5)][(parseInt(obj.id % 6)-1)] = 0;
    number.style.backgroundColor = "Gray";

    // temp code
    // for (let i = 0; i < arr2.length; i++) {
    //     for (let j = 0; j < arr2[i].length; j++) {
    //         console.log(arr2[i][j]);
    //     }
    // }

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
        // console.log("row_check"+i+" : " + check);
        if (check) row++;    //빙고 카운트
        // console.log("row:"+row);
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
        // console.log("col_check : " + check);
        if (check) col++;  //빙고 카운트 
    }

    var right = 0;
    var left = 0;

    for (let i = 0; i < arr[0].length; i++) {
        if (arr2[i][i] == 0){
            console.log("arr2["+i+"]["+i+"]"+arr2[i][i])
            right++;
        }
        if (arr2[arr2.length - i - 1][i] == 0){
            console.log("arr2["+(arr2.length-i+1)+"]["+i+"]"+arr2[i][i])
            left++;  
        } 
        if (right == 5 || left == 5) cross++;
    }
    if (right == 5 && left == 5) corss++;
    console.log("right" + right);
    console.log("left" + left);

    document.getElementById('bingoCount').innerHTML = (cross + row + col);
}