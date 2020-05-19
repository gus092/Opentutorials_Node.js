var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB Site</a></h1>
          <ul>${list}</ul>
          <a href="/create">create</a>
          ${body}
        </body>
        </html>
            `;
}
function templateList(filelist){
  var list = `<ul>`;
  var i = 0;
  while(i<filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}"">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+`</ul>`;
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;// query parse함
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){ //파일을 찾을 수 있으면
      if(queryData.id === undefined){ //루트경로 -메인페이지
        fs.readdir('./data',function(error,filelist){
          var title = 'Welcome';
          var description = 'Hello Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list,`<h2>${title}</h2>${description}`);

      //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
      //열게되 파일 내용을 description 인자로 받고 있음!
          response.writeHead(200);
          response.end(template); // 화면 띄우는 중
        });
      }else{      //본문부분 파일로 읽어오기
            //readFile열때 ``사용해서 열기
            fs.readdir('./data',function(error,filelist){
              fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list,`<h2>${title}</h2>${description}`);
            //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
            //열게되 파일 내용을 description 인자로 받고 있음!
                response.writeHead(200);
                response.end(template); // 화면 띄우는 중
              });
            });
          }
    }else if(pathname === '/create'){ //새로만든 페이지로 go
      fs.readdir('./data',function(error,filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list,`
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type = "text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description">
              </textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `);
        response.writeHead(200);
        response.end(template);
      });
    }else if(pathname === "/create_process"){//페이지를 submit하고나서
      var body = '';
      request.on('data',function(data){ // data: 수신된 정보 조각, post data양을 조절하기 위함 - 조각조각 수신
        body = body + data;
      });
      request.on('end',function(){ // 들어올 정보 조각이 이제 더이상 없으면 자동 호출
        var post = qs.parse(body);//변수 post안에 post한 내용이 들어있음
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',function(err){
          response.writeHead(302,{Location:`/?id=${title}`});//page를 다른 곳으로 redirection 시킴
          response.end();
        })
        console.log(post);
      });
    }else{ //파일을 아예 찾지 못하면
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
