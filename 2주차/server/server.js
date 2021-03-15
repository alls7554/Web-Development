const http = require('http'); 

const server = http.createServer(function(req, res){
     req.pipe(res); 
    }); 
     
server.listen(9876, '127.0.0.1');