package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// FIXME: add publish date?
type book struct {
	Title, Author string
}

var bookRecords = []book{
	{
		Title:  "The Hitchhiker's Guide to the Galaxy",
		Author: "Adams, Douglas",
	},
	{
		Title:  "Dirk Gently's Holistic Detective Agency",
		Author: "Adams, Douglas",
	},
	{
		Title:  "Snow Crash",
		Author: "Stephenson, Neal",
	},
	{
		Title:  "So Long, and Thanks for All the Fish",
		Author: "Adams, Douglas",
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

func getBooks(db *sql.DB) []book {
	log.Printf("Fetching books")

	rows, err := db.Query(`SELECT title, author FROM book ORDER BY author ASC`)
	if err != nil {
		log.Fatalf("Unable to drop book table:", err)
	}
	defer rows.Close()

	var (
		books         []book
		title, author string
	)

	for rows.Next() {
		err = rows.Scan(&title, &author)
		if err != nil {
			log.Printf("Error: %v", err.Error())
		}
		books = append(books, book{Title: title, Author: author})
	}

	return books
}

func initBooksTable(db *sql.DB) {
	log.Printf("Recreating book table")

	_, err := db.Query(`DROP TABLE book`)
	if err != nil {
		log.Fatalf("Unable to drop book table:", err)
	}

	_, err = db.Query(`CREATE TABLE book
    (id serial primary key,
    title text NOT NULL,
    author varchar(255) NOT NULL)`)
	if err != nil {
		log.Fatalf("Unable to create book table:", err)
	}

	log.Printf("Populating book table")

	for _, book := range bookRecords {
		_, err = db.Query(`INSERT INTO book (title, author) VALUES ($1,$2)`, book.Title, book.Author)
		if err != nil {
			log.Fatalf("Unable to populate book table:", err)
		}
	}
}
