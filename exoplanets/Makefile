version = v1.1.3
repo = quay.io/ffapitalle

all: fmt build run

fmt:
	gofmt -w *.go

build:
	sudo buildah bud -t exoplanets:latest .

run:
	sudo podman run \
		-p 8080:8080 \
		-e DB_HOST=$$(sudo podman inspect postgres --format '{{ .NetworkSettings.IPAddress }}') \
		-e DB_PORT=5432 \
		-e DB_USER=user \
		-e DB_PASSWORD=password \
		-e DB_NAME=postgres \
		exoplanets:latest

run-without-db:
	sudo podman run \
		-p 8080:8080 \
		exoplanets:latest

tag:
	sudo buildah tag exoplanets:latest $(repo)/exoplanets:latest
	sudo buildah tag exoplanets:latest $(repo)/exoplanets:$(version)

push:
	sudo podman push $(repo)/exoplanets:latest
	sudo podman push $(repo)/exoplanets:$(version)

pg-up:
	sudo podman run -d \
		--name postgres \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=password \
		-e POSTGRES_USER=user \
		postgres:12.1-alpine

pg-down:
	sudo podman rm -f postgres

.PHONY: fmt build run run-without-db tag push pg-up pg-down
