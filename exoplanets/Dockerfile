# -- Build stage --

FROM registry.redhat.io/ubi8/go-toolset:1.12.8 AS builder

WORKDIR $HOME/go/src/exoplanets
COPY *.go .

RUN go get -u \
      github.com/gorilla/mux \
      github.com/lib/pq && \
    go build


# -- App stage --

FROM registry.redhat.io/ubi8-minimal:8.0-213
LABEL maintainer="jbirchler@redhat.com" \
      version="v1.0.0"

WORKDIR /home

COPY --from=builder /opt/app-root/src/go/src/exoplanets/exoplanets .
COPY template.html .

RUN chmod 440 template.html && \
    chgrp -R 0 . && \
    chmod -R g=u .

USER 1001
EXPOSE 8080

CMD ["./exoplanets"]
