
FROM registry.access.redhat.com/ubi8:8.0
LABEL version="1.0" \
  description="A simple PHP application that tests TLS encryption" \
  creationDate="2019-12-13" \
  updatedDate="2019-12-13"

RUN yum install -y --disableplugin=subscription-manager --nodocs \
  httpd php php-common net-tools procps-ng \
  mod_ssl \
  && yum clean all

COPY httpd/httpd.conf /etc/httpd/conf/httpd.conf
# PHP FPM configuration both compatible with Docker and Podman
# Allows us to run php-fpm as a non-root user yet still let
# Apache read the socket
COPY httpd/www.conf /etc/php-fpm.d/www.conf

## SSL - This directive configures SSL support for the container
COPY httpd/ssl.conf /etc/httpd/conf.d/ssl.conf
## End of SSL

COPY index.php /var/www/html/index.php

RUN mkdir /run/php-fpm && \
  chgrp -R 0 /var/www/html /var/log/httpd /var/run/httpd/ /run/php-fpm \
  && chmod -R g+rwx /var/www/html /var/log/httpd /var/run/httpd/ /run/php-fpm

EXPOSE 8080 8443
USER 1001

CMD  php-fpm && httpd -D FOREGROUND
