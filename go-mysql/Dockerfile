FROM golang:1.12
LABEL maintainer="ichavero@chavero.com.mx"

RUN mkdir -p /go/src/github.com/openshift/go-mysql
WORKDIR /go/src/github.com/openshift/go-mysql

COPY . /go/src/github.com/openshift/go-mysql
RUN go get -u github.com/go-sql-driver/mysql github.com/gorilla/mux && \
    go build

CMD ["./go-mysql"]
