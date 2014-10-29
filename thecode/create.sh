docker run -d --name elasticsearch dockerfile/elasticsearch
docker run -d --name rabbitmq dockerfile/rabbitmq

docker build -t emilcardell/theapp .
docker run -d -p 8888:8888 --link elasticsearch:elasticsearch --link rabbitmq:rabbitmq --name theapp emilcardell/theapp
