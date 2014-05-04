var elasticsearchUrl = process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR || 'localhost';
var rabbitMqUrl = process.env.RABBITMQ_PORT_5672_TCP_ADDR || 'localhost';

module.exports = 
{
	ElasticsearchUrl: elasticsearchUrl,
	RabbitMqUrl: rabbitMqUrl,
}