## About this container
This container deploys a stand-alone PHP page to display some basic information about
the container. It is mostly used to determine whether this application is served via
TLS or is exposed via HTTP.

## How to build
Run the following command to build the container image:
`$ podman build -t php-ssl .`

The container expects a certificate and a key at `/usr/local/etc/ssl/certs`.
Run the following command to generate a self-signed certificate:
`$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt`

## How to run

### In HTTP mode
```
podman run --name todo -p 8080:8080 php-ssl:latest`
```

### In HTTPs mode
```
podman run --userns keep-id \
  -v ./ssl/certs:/usr/local/etc/ssl/certs:Z \
  --name todo -p 8443:8443 php-ssl:latest`
```

### In HTTP & HTTPS mode
Notice the port range:

```
podman run --userns keep-id \
  -v ./ssl/certs:/usr/local/etc/ssl/certs:Z \
  --name test \
  -p 8080-8443:8080-8443 \
  php-ssl:latest
```

### Disable HTTPs support
If you need to disable HTTPs support, run the following steps:

  1. In `Dockerfile` -- comment lines 11 & 20:
  ```
  # mod_ssl \
  ...
  # COPY httpd/ssl.conf /etc/httpd/conf.d/ssl.conf
  ```
  3. Rebuild the image:
  ```
  `$ podman build -t php-ssl:latest .`
  ```
  4. Run the following command to create the container:
  ```
  `$ podman run --name todo -p 8080:8080 php-ssl:latest`
  ```
