package main

import (
	"log"
)

func main() {
	dbClose := dbConnect(dbInfo{
		host:     "10.88.0.100",
		port:     "5432",
		user:     "user",
		password: "password",
		dbname:   "postgres"})
	defer dbClose()

	log.Fatal(listenAndServe("8080"))
}
