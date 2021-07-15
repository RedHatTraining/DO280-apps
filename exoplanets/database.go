package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type dbInfo struct {
	host, port, user, password, dbname string
}

func (d dbInfo) String() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=require sslcert=/certs/tls.crt sslkey=/certs/tls.key",
		d.host, d.port, d.user, d.password, d.dbname)
}

func dbConnect(info dbInfo) *sql.DB {
	log.Printf("Connecting to database with: %s", info)

	db, err := sql.Open("postgres", info.String())
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database")

	return db
}
