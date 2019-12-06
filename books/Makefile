version = v1.0.0

build:
	sudo buildah bud -t books:latest .

run:
	sudo podman run -p 8080:8080 books:latest

push:
	sudo buildah tag books:latest books:$(version)

pg:
	sudo podman run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -d postgres:12.1-alpine
