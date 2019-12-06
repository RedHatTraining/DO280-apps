version = v1.0.0

all: fmt build run

fmt:
	gofmt -w *.go

build:
	sudo buildah bud -t books:latest .

run:
	sudo podman run \
		-p 8080:8080 \
		-e DB_HOST=$$(sudo podman inspect postgres --format '{{ .NetworkSettings.IPAddress }}') \
		-e DB_PORT=5432 \
		-e DB_USER=user \
		-e DB_PASSWORD=password \
		books:latest

push:
	sudo buildah tag books:latest books:$(version)

pg-up:
	sudo podman run -d \
		--name postgres \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=password \
		-e POSTGRES_USER=user \
		postgres:12.1-alpine

pg-down:
	sudo podman rm -f postgres
