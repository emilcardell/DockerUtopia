echo "Creating mongo-user"
docker build -t emilcardell/rabbitmq .
docker run -d -p 5672:5672 --name rabbitmq emilcardell/rabbitmq