// Create web server application with Node.js
// Create a web server application that can serve up comments from a JSON file.
// The application should be able to accept a POST request with a JSON payload
// and save the data to the file.
// The application should be able to accept a GET request and serve up the data
// as JSON from the file.
// The application should be able to accept a PUT request with a JSON payload
// and update the data in the file.
// The application should be able to accept a DELETE request and remove the
// data from the file.

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var commentsFile = path.join(__dirname, 'comments.json');

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/comments') {
    fs.readFile(commentsFile, function(err, data) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Server error');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/comments') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      fs.readFile(commentsFile, function(err, data) {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Server error');
        } else {
          var comments = JSON.parse(data);
          var comment = JSON.parse(body);
          comments.push(comment);
          fs.writeFile(commentsFile, JSON.stringify(comments), function(err) {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.end('Server error');
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(comment));
            }
          });
        }
      });
    });
  } else if (req.method === 'PUT' && parsedUrl.pathname === '/comments') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function()