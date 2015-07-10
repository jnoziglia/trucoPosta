var insertDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('documents');
  // Insert some documents 
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('documents');
  // Find some documents 
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    assert.equal(9, docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

function logArrayElements(element, index, array) {
    console.log("a[" + index + "] = " + element);
}

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server 


var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('views/index.html');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   
    findDocuments(db, function(docs) {
        docs.forEach(function(element, index, array) {
          res.write(array[index].a.toString());
        });
        res.end(index); 
    });

  });


}).listen(8080);