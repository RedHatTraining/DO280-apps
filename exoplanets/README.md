A simple example application for use with PostgreSQL.


## Similarities to the Books Application

This application is similar to the "books" application in the same repository, and
there is currently some code duplication between the two. We considered combining
the applications into a single codebase, but the forking logic to juggle different
datasets and templates proved more complex than the value.

The exoplanets application does not include the "memory leak" feature that is
available in the books application.


## Table Drop Warning

The app drops and creates a new "exoplanets" table on start up. This is not
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

If the variables are not present, the application will run but not attempt to connect
to the database.


## Fetching Exoplanets

The exoplanet data comes from the [Open Exoplanet Catalogue](https://github.com/openexoplanetcatalogue/open_exoplanet_catalogue/).
We've included a script in this repository that pulls data from the catalog and
then outputs a small subset of the planets as a Go struct. This approach makes it
easy to refresh the data: `python3 fetch_planets.py > seed.go`


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
