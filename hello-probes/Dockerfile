# podman build -t hello-probes:latest .
# skopeo copy containers-storage:localhost/hello-probes:latest docker://quay.io/redhattraining/hello-probes:v0.1

FROM rhel8/nodejs-12

MAINTAINER username "username@example.com"

EXPOSE 3000

COPY . /opt/app-root/src

RUN npm install

CMD /bin/bash -c 'npm start'
