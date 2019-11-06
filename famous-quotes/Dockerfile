FROM golang:1.12
LABEL maintainer="ichavero@chavero.com.mx"

RUN mkdir -p /go/src/github.com/openshift/famous-quotes
WORKDIR /go/src/github.com/openshift/famous-quotes

COPY . /go/src/github.com/openshift/famous-quotes
RUN go get -u github.com/go-sql-driver/mysql github.com/gorilla/mux && \
    go build

CMD ["./famous-quotes"]
