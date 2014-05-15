FROM ubuntu:trusty

# Install Node.js
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs

# Append to $PATH variable.
RUN echo '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bash_profile

# Bundle app source
ADD . /src

# Install app dependencies
RUN cd /src; npm install; npm install forever -g

EXPOSE  8888

CMD forever /src/main.js