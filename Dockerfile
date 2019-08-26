FROM ubuntu:disco

ENV NODE_VERSION 10

RUN set -x && \
  apt-get update && \
  apt-get install -y \
    ca-certificates \
    curl \
    git \
    python3-pip \
  && \
  : "to fix vulnerabilities, update following packages" && \
  : apt-get install -y --no-install-recommends \
    bzip2 \
  && \
  : "install awscli" && \
  pip3 install awscli && \
  : "install node" && \
  curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g npm && \
  : "cleanup apt caches" && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  : "add working user" && \
  useradd -m getto && \
  : "prepare app directory" && \
  mkdir -p /opt/app && \
  chown getto:getto /opt/app && \
  : "environment prepared"

COPY package*.json /opt/app/

WORKDIR /opt/app
USER getto

RUN set -x && \
  : "install node modules" && \
  npm clean-install && \
  : "project prepared"

CMD ["/bin/bash"]