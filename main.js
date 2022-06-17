var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/" || pathname === "/index.html") {
    if (queryData.id === undefined) {
      //홈 화면
      topic.home(response, request);
    }
    else {
      //서브(상세) 화면
      topic.sub(response, request, queryData);
    }
  } else if (pathname === "/create") {
    //작성
    topic.createForm(response, request);

  } else if (pathname === "/create_process") {
    //작성 처리
    topic.createProcess(response, request);
  }
  else if (pathname === "/update") {
    //수정
    topic.updateForm(response, request, queryData );
  }
  else if (pathname === "/update_process") {
    //수정처리
    topic.updateProcess(response, request);
  }
  else if (pathname === "/process_delete") {
    //삭제처리
    topic.deleteProcess(response, request);
  }
  else if (pathname === "/author") {
    //작성자관리로 이동
    author.home(response, request);
  }
  else if(pathname === "/author/create_process")
  {
    //작성자 생성
    author.createProcess(response, request);
  }
  else if (pathname === "/author/update")
  {
    //작성자 수정
    author.update(response, request, queryData);
  }
  else if (pathname === "/author/update_process"){
    // 작성자 수정 처리
    author.updateProcess(response, request);
  }
  else if (pathname === "/author/delete")
  {
    // 작성자 삭제 처리
    author.deleteProcess(response, request);
  }
  else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);