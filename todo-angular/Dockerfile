
FROM registry.access.redhat.com/ubi8:8.0

LABEL version="1.0" \
  description="A simple To Do Application" \
  creationDate="2017-12-25" \
  updatedDate="2019-11-28"

RUN yum install -y --disableplugin=subscription-manager --nodocs \
  nginx nginx-mod-http-perl \
  && yum clean all

COPY nginx/nginx.conf /etc/nginx/nginx.conf
# SSL - these two directive install the SSL configuration file
# This copies the Diffie-Hellman settings. Used by NGinx
COPY nginx/dhparam.pem /etc/ssl/conf/dhparam.pem
COPY nginx/conf.d/ssl.conf /etc/nginx/conf.d/ssl.conf
## End of SSL

RUN touch /run/nginx.pid \
  && chgrp -R 0 /var/log/nginx /run/nginx.pid \
  && chmod -R g+rwx /var/log/nginx /run/nginx.pid

COPY src/ /usr/share/nginx/html

EXPOSE 8080 8443

USER 1001

CMD nginx -g "daemon off;"
