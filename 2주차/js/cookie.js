var setCookie = function (value) {
    var user_name = $("#user_name").val();

    if(user_name == ""){
        alert("nickname 설정");
        return;
    }

    document.cookie = user_name + '=' + value  + ';path=/';
    location.href='./game.html';
};

var getCookie = function() {
    var value = document.cookie.split('=');
    
    return value? value[0] : null;
};
        
var deleteCookie = function() {
    let name = document.getElementById("my_name").innerHTML;
    document.cookie = name + '=true; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
}

var clearAllCookies = function(domain, path) {
    var doc = document,
        domain = domain || doc.domain,
        path = path || '/',
        cookies = doc.cookie.split(';'),
        now = +(new Date);
    for (var i = cookies.length - 1; i >= 0; i--) {
      doc.cookie = cookies[i].split('=')[0] + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT'; domain=' + domain + '; path=' + path';
    }
}