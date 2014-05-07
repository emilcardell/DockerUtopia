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
docker kill bgworker
docker rm bgworker

echo "remove link"
docker rm -link bgworker/elasticsearch
docker rm -link bgworker/rabbitmq

fi

echo "run docker"
docker run -d -link bgworker:elasticsearch -link bgworker:rabbitmq -name bgworker emilcardell/bgworker

echo "Check if all containers are running"
if docker ps | grep -q bgworker; then 
		echo "The bgworker is RUNNING";
	else
		echo "The bgworker is DOWN";
		exit 1 
fi


exit $?