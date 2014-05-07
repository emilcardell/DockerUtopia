FROM ubuntu:quantal
MAINTAINER Fernando Mayo <fernando@tutum.co>

# Install RabbitMQ
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y upgrade && DEBIAN_FRONTEND=noninteractive apt-get install -y rabbitmq-server pwgen

# Add scripts
ADD run.sh /run.sh
RUN chmod 755 ./*.sh

EXPOSE 5672
CMD ["/run.sh"]
