var uuid = require('node-uuid');
var sugar = require('sugar');

var config = require('./config.js');
var log = config.Log;

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.ElasticsearchUrl + ':9200'
});

var amqp = require('amqp');
var connection = amqp.createConnection({ host: config.RabbitMqUrl });

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());

app.use("/", express.static(__dirname + "/static"));

app.get("/", function(req, resp){
  resp.sendfile(__dirname + "/static/index.html");
});

app.get("/tasks", function(req, resp){
  var query = req.query.query;
  
  if(!query){
    client.search({
      index: 'todos',
      size: 1000,
      body: {
        query: {
          "match_all" : { }
        },
        sort: [
              { Created: "desc" }
          ]
      }
    }).then(function (searchResp) {
      
      var result = searchResp.hits.hits.map(function(hit){
        return hit._source;
      });

      return resp.json({ TotalHits: searchResp.hits.total, Result: result });
    },function (error) {
      return resp.json({ TotalHits: 0, Result: [] });
    });
  }
  else
  {
     client.search({
      index: 'todos',
      size: 1000,
      body: {
        query: {
          "wildcard" : {
            "Body" : query + "*"
          }
        },
        sort: [
              { Created: "desc" }
          ]
      }
    }).then(function (searchResp) {
      
      var result = searchResp.hits.hits.map(function(hit){
        return hit._source;
      });

      return resp.json({ TotalHits: searchResp.hits.total, Result: result });
    },function (error) {
      return resp.json({ TotalHits: 0, Result: [] });
    });

  }


});

app.post("/task", function(req, resp){
  var taskToCreate = req.body;
  if(!taskToCreate || !taskToCreate.Body){
    return resp.send(400);
  }

  taskToCreate.Id = uuid.v1();
  taskToCreate.Created = new Date();

  connection.publish("todoCreated", taskToCreate);
  return resp.json(taskToCreate);            
});


client.indices.exists({
   index: 'todos'
 }
 , function(err, response, status){
   if(err){
      console.log(err);       
        return;
   };

  //setting up indices
   if(!response){
     client.indices.create({
       index: 'todos',
       type: 'todo',
       mappings : {
             "todo" : {
                 "properties" : {
                  "Id" : { 
                     "type" : "string",
                     "index" : "not_analyzed"                      
                   },
                 "Body" : { 
                     "type" : "string",
                     "index" : "analyzed"                      
                   },
                   "Created" : {
                     "type" : "date",
                     "index" : "analyzed",
                     "format" : "date_time"  
                   } 
               }
           }
             
         }
     }, function(err, response, status){
       if(err){
          console.log(err);
       };  
     });

   }
});

require('./backgroundWorker.js').start();
app.listen(8888);