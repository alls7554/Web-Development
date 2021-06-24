$(document).on("keydown", "div.publisher input", function (e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    e.preventDefault();

    let user_name = document.getElementById("my_name").innerText;

    // 메시지 전송
    sendMessage(user_name);
    // 입력창 clear
    clearMsg();
  }
});

// 메시지 입력창 초기화
function clearMsg() {
  $("#msg").val("");
}
