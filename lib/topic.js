var template = require("./template");
var db = require("./db");
var qs = require("querystring");

exports.home = function (response, request) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error2, authors) {
      var title = "환영합니다. ";
      var description = "홈페이지 입니다. ";
      var list = template.list(topics, authors);
      var html = template.html(title, list, `<h2>${title}</h2> <p>${description}</p>`, `<a href="/create">글작성</a>`);
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.sub = function (response, request, queryData) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error;
    }

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`, [queryData.id], function (error2, topic_row1) {
      db.query(`SELECT * FROM author`, function (error2, authors) {
        if (error2) {
          throw error2;
        }
        var title = topic_row1[0].title;
        var description = topic_row1[0].description;
        var list = template.list(topics, authors);
        var html = template.html(
          title,
          list,
          `<h2>${title}</h2> <p>${description}</p> <p>${topic_row1[0].name}</p> <p>${topic_row1[0].created}</p>`,
          `<div style="display: inline-block;"><a href="/create">글작성</a> <a href="/update?id=${queryData.id}">글수정</a>
       <form action="process_delete" method="post" style="display: inline;">
        <input type="hidden" name="id" value="${queryData.id}"/>
        <input type="submit" value="글삭제" onclick="return confirm('정말로 삭제하시겠습니까?');" >
       </form></div>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.createForm = function (response, request) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error2, authors) {
      var title = "CREATE ";
      var list = template.list(topics, authors);
      var html = template.html(
        title,
        list,
        `<form action="http://localhost:3000/create_process" method="post">
             <p><input type="text" name="title"></p>
               <p>
                   <textarea name="description"></textarea>
               </p>
               <p>
                 ${template.authorSelect(authors)}

               </p>
               <p>
                   <input type="submit">
               </p>
               </form>`,
        `<a href="/create">글작성</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.createProcess = function (response, request) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });

  request.on("end", function () {
    var post = qs.parse(body);
    db.query(`INSERT INTO topic(title, description, created, author_id) VALUES(?,?, now(), ?)`, [post.title, "★" + post.description, post.author], function (error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: `https://naver.com` });
      response.end();
    });
  });
};

exports.updateForm = function (response, request, queryData) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error;
    }

    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic_row1) {
      if (error2) {
        throw error2;
      }
      db.query(`SELECT * FROM author`, function (error2, authors) {
        var list = template.list(topics, authors);
        var html = template.html(
          topic_row1[0].title,
          list,
          `<form action="http://localhost:3000/update_process" method="post">
                    <input type="hidden" name="id" value="${topic_row1[0].id}">
                <p><input type="text" name="title" value="${topic_row1[0].title}"></p>
                <p>
                    <textarea name="description">${topic_row1[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic_row1[0].author_id)}
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>`,
          `<a href="/create">글작성</a> <a href="/update?id=${topic_row1[0].id}">글수정</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.updateProcess = function (response, request) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });

  request.on("end", function () {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    var id = post.id;

    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function (error, result) {
      response.writeHead(302, { Location: `/?id=${post.id}` });
      response.end("update_process success!!");
    });
  });
};

exports.deleteProcess = function (response, request) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });

  request.on("end", function () {
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: `/` });
      response.end("delete_process success!!");
    });
  });
};
