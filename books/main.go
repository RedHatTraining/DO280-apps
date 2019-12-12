package main

import (
	"database/sql"
	"log"
	"os"
)

func main() {
	var (
		db    *sql.DB
		books *Books
	)

	if os.Getenv("DB_HOST") != "" {
		db = dbConnect(dbInfo{
			host:     os.Getenv("DB_HOST"),
			port:     os.Getenv("DB_PORT"),
			user:     os.Getenv("DB_USER"),
			password: os.Getenv("DB_PASSWORD"),
			dbname:   os.Getenv("DB_NAME")})
		defer db.Close()
	}

	books = &Books{DB: db}
	books.populate()

	log.Fatal(listenAndServe("8080", books))
}
