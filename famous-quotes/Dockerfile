FROM golang:1.12
LABEL maintainer="ichavero@chavero.com.mx"

ENV QUOTES_VERSION=2.1 \
    SUMMARY="Famous Quotes" \
    DESCRIPTION="Famous Quotes is a PoC application for Go and MySQL"

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="$DESCRIPTION" \
      io.k8s.display-name="Quotes 2.1" \
      io.openshift.expose-services="8000:quotes" \
      io.openshift.tags="poc,mysql,golang" \
      name="redhattraining/famous-quotes" \
      version="2.1" \
      usage="docker run -d -e QUOTES_USER=user -e QUOTES_PASSWORD=pass -e QUOTES_DATABASE=db -p 8000:8000 redhattraining/famous-quotes" \
      maintainer="Iván Chavero <ichavero@chavero.com.mx>"

EXPOSE 8000

RUN mkdir -p /go/src/github.com/openshift/famous-quotes
WORKDIR /go/src/github.com/openshift/famous-quotes

COPY . /go/src/github.com/openshift/famous-quotes
RUN go get -u github.com/go-sql-driver/mysql github.com/gorilla/mux && \
    go build

CMD ["./famous-quotes"]
