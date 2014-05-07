echo "pull and create elasticsearch"
docker pull dockerfile/elasticsearch
docker run -d -p 9200:9200 --name elasticsearch dockerfile/elasticsearch
