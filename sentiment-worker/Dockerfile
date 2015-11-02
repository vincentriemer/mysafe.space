FROM java:8

# install node
RUN set -ex \
  && for key in \
    7937DFD2AB06298B2293C3187D33FF9D0246406D \
    114F43EE0176B71C7BC219DD50A3051F888C628D \
  ; do \
    gpg --keyserver hkp://hkps.pool.sks-keyservers.net:80 --recv-keys "$key"; \
  done

ENV NODE_VERSION 0.10.40
ENV NPM_VERSION 2.14.1

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --verify SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
  && npm install -g npm@"$NPM_VERSION" \
  && npm cache clear

RUN apt-get update
RUN apt-get -y install wget unzip build-essential zlibc zlib1g zlib1g-dev openssl libssl-dev

# install CoreNLP
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

WORKDIR /usr/src/app

# install dependencies
COPY package.json /usr/src/app/package.json
RUN npm install

RUN wget http://nlp.stanford.edu/software/stanford-corenlp-full-2015-04-20.zip
RUN mkdir corenlp
RUN unzip -j stanford-corenlp-full-2015-04-20.zip -d ./corenlp

# copy app src
COPY . /usr/src/app

CMD ["npm", "start"]