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

			// Receive messages
			q.subscribe(function (message) {
			// Print messages to stdout
			console.log(JSON.stringify(message));
			}
		}

		connection.queue('todoDone', function(q){
			// Catch all messages
			q.bind('#');

			// Receive messages
			q.subscribe(function (message) {
			// Print messages to stdout
			console.log(JSON.stringify(message));
			}
		}
	}
}