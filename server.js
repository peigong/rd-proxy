var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');

var app = require('express')();
var proxy = require('express-http-proxy');

var conf = require('./conf.json');

app.use('/',
    proxy(function(req){
        var host;
        var hostname = host = req.hostname || '';
        var port = conf.settings[hostname];
        if(port){
            host = [
                'http',
                ['//', conf.target].join(''),
                port
            ].join(':');
        }
        console.log([hostname, host].join(' -> '));
        return host;
    })
);

//根据项目的路径导入生成的证书文件
var privateKey  = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};
  
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//可以分别设置http、https的访问端口号
var PORT = 80;
var SSLPORT = 443;
 
//创建http服务器
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

//创建https服务器
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
