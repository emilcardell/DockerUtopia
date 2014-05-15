docker run -d -p 9200:9200 --name elasticsearch dockerfile/elasticsearch
docker run -d -p 5672:5672 --name rabbitmq emilcardell/rabbitmq