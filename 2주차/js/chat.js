

    $(document).on('keydown', 'div.publisher input', function(e){
                    if(e.keyCode == 13 && !e.shiftKey) {
                        e.preventDefault();
                        if(msg == "") return;
                        
                        const message = $("#msg").val();
        
                        // 메시지 전송
                        sendMessage(message);
                        // 입력창 clear
                        clearMsg();
                        
                    }
    });
function sendMessage() {

    var msg = $("#msg").val();
    
    if(msg == "") return;

    var chat = $("#chat_list");
    chat.append("<li class='list-group-item list-group-item-success me'><span>나 :" +  msg + "</span></li>");
    // 스크롤바 아래 고정
    $('div.chat_log').scrollTop($('div.chat_log').prop('scrollHeight'));
    clearMsg();
}

function clearMsg(){
    $("#msg").val("");
}