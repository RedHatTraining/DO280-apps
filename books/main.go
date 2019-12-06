package main

import (
	"log"
	"os"
)

func main() {
	db := dbConnect(dbInfo{
		host:     os.Getenv("DB_HOST"),
		port:     os.Getenv("DB_PORT"),
		user:     os.Getenv("DB_USER"),
		password: os.Getenv("DB_PASSWORD"),
		dbname:   "postgres"})
	defer db.Close()

	initBooksTable(db)

	log.Fatal(listenAndServe("8080", db))
}
