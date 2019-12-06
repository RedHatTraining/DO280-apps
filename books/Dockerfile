# -- Build stage --

FROM registry.redhat.io/ubi8/go-toolset:1.12.8 AS builder

WORKDIR $HOME/go/src/books
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

COPY --from=builder /opt/app-root/src/go/src/books/books .
COPY template.html .
RUN chmod 444 template.html

USER nobody
EXPOSE 8080

CMD ["./books"]
