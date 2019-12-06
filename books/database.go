package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type book struct {
	ID            int
	Title, Author string
}

var books = []book{
	{
		ID:     1,
		Title:  "The Hitchhiker's Guide to the Galaxy",
		Author: "Adams, Douglas",
	},
	{
		ID:     2,
		Title:  "Dirk Gently's Holistic Detective Agency",
		Author: "Adams, Douglas",
	},
	{
		ID:     3,
		Title:  "Snow Crash",
		Author: "Stephenson, Neal",
	},
}

type dbInfo struct {
	host, port, user, password, dbname string
}

func (d dbInfo) String() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		d.host, d.port, d.user, d.password, d.dbname)
}

var db *sql.DB

func dbConnect(info dbInfo) func() {
	log.Printf("connecting to database with: %s", info)

	db, err := sql.Open("postgres", info.String())
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("connected to database")

	return func() {
		err := db.Close()
		if err != nil {
			log.Fatal(err)
		}
	}
}
