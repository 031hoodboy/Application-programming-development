const db = require("./db");
var template = require("./template");
var qs = require('querystring');

exports.home = function (response, request) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        db.query(`SELECT * FROM author`, function (error2, authors) {
            var title = "작성자관리";
            var list = template.list(topics);
            var html = template.html(title, list,
                `${template.authorTable(authors)}
                <style>
                    table {
                        border: solid 1px black;
                        border-collapse : collapse;
                    }
                    td {
                        border: solid 1px black;                       
                    }
                </style>
                
                <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                    </form>
                `
                ,
                ``);
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
        db.query(`INSERT INTO author(name, profile) VALUES(?,?)`, [post.name, post.profile],
            function (error, result) {
                if (error) { throw error; }
                response.writeHead(302, { Location: `/author` });
                response.end();
            }
        );
    });
}


exports.update = function (response, request, queryData) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(
            `SELECT * FROM author`,
            function (error2, authors) {

                if (error2) {
                    throw error2;
                }
                db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function (error3, author_row1) {

                    var title = "작성자 수정";
                    var list = template.list(topics);
                    var html = template.html(
                        title,
                        list,
                        `${template.authorTable(authors)}
                <style>
                    table {
                        border: solid 1px black;
                        border-collapse : collapse;
                    }
                    td {
                        border: solid 1px black;                       
                    }
                </style>
                
                <form action="/author/update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${queryData.id}">
                </p>
                <p>
                    <input type="text" name="name" value="${author_row1[0].name}">
                </p>
                <p>
                    <textarea name="profile">${author_row1[0].profile}</textarea>
                </p>
                <p>
                    <input type="submit" value="수정">
                </p>
                    </form>`,
                        ``
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
}


exports.updateProcess = function(response, request){

    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    
    request.on("end", function () {
      var post = qs.parse(body);    
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], function (error, result) {
        response.writeHead(302, { Location: `/author` });
        response.end("");
      });
    
    });
}



exports.deleteProcess = function(response, request) {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });

    request.on("end", function () {
      var post = qs.parse(body);
      db.query(`DELETE FROM author WHERE id=?`, [post.id], function (error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      });
    });
}
