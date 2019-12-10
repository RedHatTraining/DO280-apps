A simple example application for use with PostgreSQL.

Currently, the app drops and creates a new "book" table on start up. This is not
ideal in a deployment or any real scenario, but makes everything easy from an
instructional point of view. A better approach would be to create a job that populates
the initial data.

## Environment Variables

We use the following ENVs to connect to the database:

  * `DB_HOST`
  * `DB_PORT`
  * `DB_USER`
  * `DB_PASSWORD`
  * `DB_NAME`

## Building

A Makefile exists to avoid the burden of remembering things.

  * `make build`: Builds a container
  * `make`: Gofmt, build, and run (locally).


## Pushing

First log podman in to quay.io/redhattraining and verify the `version` and `repo` variables in the Makefile.

Once that's all good: `make tag push`.


## Local Development

There are a few helper tasks in the Makefile that might be of use:

  * `make pg-up`: Starts a PostgreSQL container.
  * `make pg-down`: Completely stops (rm -f) PostgreSQL.
  * `make run`: Runs the app (you'll need to build it first) with DB_HOST to the ip
  of the postgres container.
  * `make`: Gofmt, build, and run (locally).
