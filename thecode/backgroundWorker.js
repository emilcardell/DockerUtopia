var config = require('./config.js');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.ElasticsearchUrl + ':9200'
});

var amqp = require('amqp');
var connection = amqp.createConnection({ host: config.RabbitMqUrl });

exports.start = function () {

	// Wait for connection to become established.
	connection.on('ready', function () {
		// Use the default 'amq.topic' exchange
		connection.queue('todoCreated', function(q){
			// Catch all messages
			q.bind('#');

			q.subscribe(function (taskToCreate) {

				client.index({
		          index: 'todos',
		          type: 'todo',
		          id: taskToCreate.Id,
		          body: taskToCreate
		        }, function (err, contentResp) {
		          if(err){
		            console.log(JSON.stringify(err));
		          }
		        });
			
			});
		});
	});
}