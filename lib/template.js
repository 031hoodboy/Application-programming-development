var template ={
    html : function (title, list, body, control)
    {
      return `<!doctype html>
           <html>
           <head>
             <title>WEB1 - ${title}</title>
             <meta charset="utf-8">
           </head>
           <body>
             <h1><a href="index.html">WEB</a></h1>
             <a href="/author">작성자관리1</a>
            ${list}
            ${control}
             <p>${body}</p>
           </body>
           </html>`;
    }, list : function (topics)
    {
      var list = "<ol>";
            var i = 0;
            while (i < topics.length) {
              list =
                list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
              i = i + 1;
            }
            list = list + "</ol>";
            return list;
    }, authorSelect : function(authors, author_id){
      var tag = '';
      var i = 0;
      while (i < authors.length) {
        var selected ='';
        if(authors[i].id == author_id)
        {
          selected = 'selected';
        }
        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
        i++;
      }

      return `<select name="author">
        ${tag}
      </select>`;
    }, authorTable : function(authors){
      var tag = "<table>";
      var i = 0;
      while (i < authors.length) {
          tag += `
          <tr>
          <td>${authors[i].name}</td>
          <td>${authors[i].profile}</td>
          <td><a href="/author/update?id=${authors[i].id}">[수정하기]</a></td>
          <td>
            <form method="POST" action="/author/delete">
              <input type="hidden" name="id" value="${authors[i].id}">
              <input type="submit" value="delete" onclick="return confirm('정말로 삭제하시겠습니까?');">
            </form>
          </td>
          </tr>
          `;
          i++;
      }
      tag += "</table>";

      return tag;
    }
  };

  module.exports = template;