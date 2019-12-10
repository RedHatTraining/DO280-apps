FROM registry.access.redhat.com/ubi8/python-36:latest

LABEL version="1.0" \
  description="Application for stressing the system" \
  creationDate="2019-12-10" \
  updatedDate="2019-12-28"

USER 0
RUN pip3 install numpy

ADD load.py $HOME/

ENTRYPOINT [ "python3", "./load.py" ]

USER 1001
