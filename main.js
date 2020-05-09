var http = require('http');
var fs = require('fs');
var url = require('url');//url 모듈사용

var app = http.createServer(function(request,response){

    var _url = request.url;
    var queryData = url.parse(_url, true).query;// query parse함

    var pathname = url.parse(_url,true).pathname;

    if(pathname === '/'){ //파일을 찾을 수 있으면
      if(queryData.id === undefined){ //루프경로를 찾을 땐
        fs.readFile(`data/${queryData.id}`,'utf8',function(err, description){
          var title = 'Welcom';
          var description = 'Hello Node.js';
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
      `
      //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
      //열게되 파일 내용을 description 인자로 받고 있음!
          response.writeHead(200);
          response.end(template); // 화면 띄우는 중
        });
      }else{      //본문부분 파일로 읽어오기
            //readFile열때 ``사용해서 열기
            fs.readFile(`data/${queryData.id}`,'utf8',function(err, description){
                  var title = queryData.id;
                  var template = `
              <!doctype html>
              <html>
              <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
              </head>
              <body>
                <h1><a href="/">WEB</a></h1>
                <ol>
                  <li><a href="/?id=HTML">HTML</a></li>
                  <li><a href="/?id=CSS">CSS</a></li>
                  <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ol>
                <h2>${title}</h2>
                <p>${description}</p>
              </body>
              </html>
          `
          //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
          //열게되 파일 내용을 description 인자로 받고 있음!
              response.writeHead(200);
              response.end(template); // 화면 띄우는 중
            });
      }

    }else{ //파일을 아예 찾지 못하면

      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);
