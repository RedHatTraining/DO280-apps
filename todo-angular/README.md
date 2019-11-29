## About this container
This container deploys a stand-alone To Do application written in AngularJS.
The web server supports both HTTP and HTTPs connection.

## How to build
Run the following command to build the container image:
`$ podman build -t do280/todo-angular:latest .`

The current application provides a self-signed certificate in `ssl`. Their names
would match the certificates name in OpenShift.
If you need to regenerate a self-signed certificate,run the following command:
`$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt`

If you need to recreate a Diffie-Hellman group, run the following command:
`$ openssl dhparam -out dhparam.pem 2048`

## How to run

### In HTTP mode
```
podman run --userns keep-id \
  -v ./ssl/certs:/usr/local/etc/ssl/certs:Z \
  --name todo -p 8080:8080 \
  do280/todo-angular:latest`
```

### In HTTPs mode
```
podman run --userns keep-id \
  -v ./ssl/certs:/usr/local/etc/ssl/certs:Z \
  --name todo -p 8443:8443 \
  do280/todo-angular:latest`
```

### In HTTP & HTTPS mode
Notice the port range:

```
podman run --userns keep-id \
  -v ./ssl/certs:/usr/local/etc/ssl/certs:Z \
  --name test \
  -p 8080-8443:8080-8443 \
  do280/todo-angular:latest
```

### Disable HTTPs support
If you need to disable HTTPs support, run the following steps:

  1. In `Dockerfile` -- comment lines 16 and 17:
  ```
  # COPY nginx/dhparam.pem /etc/ssl/conf/dhparam.pem
  # COPY nginx/conf.d/ssl.conf /etc/nginx/conf.d/ssl.conf
  ```
  2. In `nginx/nginx.conf`comment line 38 & 66-67:
  ```
  # include /etc/nginx/conf.d/*.conf;
  ...
  # error_page 497 https://$host:8443$request_uri;
  # return 301 https://$host:8443$request_uri;
  ```
  3. Rebuild the image:
  ```
  `$ podman build -t do280/todo-angular:latest .`
  ```
  4. Run the following command to create the container:
  ```
  `$ podman run --name todo -p 8080:8080 do280/todo-angular:latest`
  ```
