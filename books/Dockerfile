# -- build stage --

FROM registry.redhat.io/ubi8/go-toolset:1.12.8 AS builder

WORKDIR $HOME/go/src/books
COPY main.go .

RUN go get -u github.com/gorilla/mux && \
    go build


# -- app stage --

FROM registry.redhat.io/ubi8-minimal:8.0-213
LABEL maintainer="jbirchler@redhat.com"

WORKDIR /home
COPY --from=builder /opt/app-root/src/go/src/books/books /home

USER nobody

ENTRYPOINT ["./books"]
