
var send = function() {
    var msg = $("#msg").val();
    if(msg == "") return;
    var chat = $("#chat_list");
    chat.append("<li class='list-group-item list-group-item-success me'><span>나 :" +  msg + "</span></li>");
    
    $("#msg").val("");
}
