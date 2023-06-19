# MySQL helm chart

A Helm chart for building and deploying a [MySQL](https://github/sclorg/mysql-container) application on OpenShift.

For more information about helm charts see the official [Helm Charts Documentation](https://helm.sh/).

You need to have access to a cluster for each operation with OpenShift 4, like deploying and testing.

## Values
Below is a table of each value used to configure this chart.

| Value                                       | Description | Default | Additional Information |
|---------------------------------------------| ----------- | -- | ---------------------- |
| `database_service_name`                     | The name of the OpenShift Service exposed for the database. | `mysql` | - |
| `mysql_user`                                | Username for MySQL user that will be used for accessing the database. | `testu` | Expresion like: `user[A-Z0-9]{3}` |
| `mysql_root_password`                       | Password for the MySQL root user. | `testur` | Expression like: `[a-zA-Z0-9]{16}` |
| `mysql_database`                            | Name of the MySQL database accessed. | `testdb` |  |
| `mysql_password`                            | Password for the MySQL connection user. | `testp` | Expression like: `[a-zA-Z0-9]{16}` |
| `mysql_version`                             | Version of MySQL image to be used (8.0-el8, or latest). | `8.0-el8` |  |
| `namespace`                                 | The OpenShift Namespace where the ImageStream resides. | `mysql-persistent-testing` | |
| `memory_limit`                              | Maximum amount of memory the container can use. | `521Mi` |  |
| `volume_capacity`                           | Volume space available for data, e.g. 512Mi, 2Gi. | `1Gi` |  |
