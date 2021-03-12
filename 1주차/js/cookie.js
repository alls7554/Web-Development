var setCookie = function (value) {
    user_name = $("#user_name").val();
    document.cookie = user_name + '=' + value  + ';path=/';
    location.href='./game.html';
};

var getCookie = function() {
    var value = document.cookie.split('=');
    document.getElementById("my_name").innerHTML = value[0];
    document.getElementById("winner").innerHTML = value[0];
    return value? value[0] : null; 
};

var deleteCookie = function() {
    let name = document.getElementById("my_name").innerHTML;
    document.cookie = name + '=true; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
}