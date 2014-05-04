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

/*
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});
*/
app.use("/", express.static(__dirname + "/static"));

app.get("/", function(req, resp){
  resp.sendfile(__dirname + "/static/index.html");
});

app.get("/tasks", function(req, resp){
  req.json([]);
  //List form elastic search
});

app.post("/task", function(req, resp){
  var taskToCreate = req.body;
  taskToCreate.Id = uuid.v1();
  taskToCreate.Created = new Date();

   client.index({
          index: 'todos',
          type: 'todo',
          id: taskToCreate.Id,
          body: taskToCreate
        }, function (err, contentResp) {
          if(err){
            console.log(err);        
            return resp.send(500);
          }
          else
          {
            //Send to queue
            connection.publish("todoCreated", taskToCreate);
            return resp.json(taskToCreate);            
          }
        });
});

app.post("/done", function(req, resp){
  req.send(200);
  //Send to rabbitMQ
});


client.indices.exists({
   index: 'todos'
 }
 , function(err, response, status){
   if(err){
      console.log(err);       
        return;
   };

   if(!response){
     client.indices.create({
       index: 'todos',
       type: 'todo',
       mappings : {
             "todo" : {
                 "properties" : {
                 "Body" : { 
                     "type" : "string",
                     "index" : "analyzed"                      
                   },
                  "Done" : { 
                     "type" : "boolean",
                     "index" : "analyzed"                      
                   },
                   "Created" : {
                     "type" : "date",
                     "index" : "analyzed"  
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

app.listen(8888);