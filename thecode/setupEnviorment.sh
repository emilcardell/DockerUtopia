docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 dockerfile/elasticsearch
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 dockerfile/rabbitmq