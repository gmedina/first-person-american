var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

	if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      var contentType = ""
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      if(filename.indexOf('.css') != -1) {
        contentType = {"Content-Type" : "text/css"};
      }
      else if(filename.indexOf('.js') != -1) {
        contentType = {"Content-Type" : "application/x-javascript"};
      } 
      else if(filename.indexOf('.html') != -1) {
        contentType = {"Content-Type" : "text/html"};
      }
      else {
        contentType = {};
      }

      console.log(filename);
      console.log(contentType); 
      response.writeHead(200, contentType);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");