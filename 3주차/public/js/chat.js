// var socket = io();

// $(document).on('keydown', 'div.publisher input', function(e){
//     if(e.keyCode == 13 && !e.shiftKey) {
//         e.preventDefault();
        
//         let user_name = document.getElementById('my_name').innerText;
        
//         // 메시지 전송
//         sendMessage(user_name);
//         // 입력창 clear
//         clearMsg();
        
//     }
// });

// // 다른 사람이 메시지 전송시 받기
// socket.on('SEND', function(user_name, msg){
    
//     $("#chat_list").append("<li class='list-group-item list-group-item-success'><span>"+ user_name + ":" + msg +"</span></li>");
// })

// // 메시지 전송
// function sendMessage(user_name) {
//     var msg = $("#msg").val();
    
//     if(msg == "") return;

//     socket.emit('SEND', user_name, msg);

//     $("#chat_list").append("<li class='list-group-item list-group-item-success me'><span>" + user_name + "(나):" + msg +"</span></li>");
    
//     // 스크롤바 아래 고정
//     $('div.chat_log').scrollTop($('div.chat_log').prop('scrollHeight'));
//     clearMsg();
// }

// // 메시지 입력창 초기화
// function clearMsg(){
//     $("#msg").val("");
// }