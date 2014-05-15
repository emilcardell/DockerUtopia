#!/bin/sh
npm install
docker build -t emilcardell/theapp .

if docker ps | grep -q elasticsearch; then 
		echo "The elasticsearch is RUNNING";
	else
		echo "Starting elasticsearch";
		docker run -d --name elasticsearch dockerfile/elasticsearch
fi

if docker ps | grep -q rabbitmq; then 
		echo "The rabbitmq is RUNNING";
	else
		echo "Starting rabbitmq";
		docker run -d -p 5672:5672 --name rabbitmq emilcardell/rabbitmq
fi


if docker ps | grep -q theapp; then 

echo "kill and remove"
docker kill theapp
docker rm theapp

echo "remove link"
docker rm -link theapp/elasticsearch
docker rm -link theapp/rabbitmq

fi

echo "run docker"
docker run -d -p 8888:8888 --link elasticsearch:theapp --link rabbitmq:theapp --name theapp emilcardell/theapp

echo "Check if all containers are running"
if docker ps | grep -q theapp; then 
		echo "The theapp is RUNNING";
	else
		echo "The theapp is DOWN";
		exit 1 
fi


exit $?