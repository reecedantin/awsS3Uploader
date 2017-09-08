var AWS = require('aws-sdk');
var fs = require('fs');
const request = require('request');
const http = require('http');

var s3 = new AWS.S3();

var url = "http://192.168.0.203/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=admin&password=admin1"


function getImage() {
    request.get({url: url, encoding: 'binary'}, function (err, response, body) {
      fs.writeFile("aws.jpeg", body, 'binary', function(err) {
        if(err)
          console.log(err);
        else
          fs.readFile("aws.jpeg", function(err, fileData) {
              putToS3(fileData)
          });
        });
    });
}


function putToS3(data) {
    var params = {
     Body: new Buffer(data),
     Bucket: "thomasdantins3",
     Key: "upload.jpeg",
     ACL: 'public-read',
     ContentType: 'binary',
     ContentEncoding: 'utf8'
    };

    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}

setInterval(function() {
    getImage()
}, 30000)
