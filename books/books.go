package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)


type Book struct {
	Title, Author string
	Year          int
}

type Books struct {
	DB   *sql.DB
	List []Book
}


func (b *Books) fetch() {
	log.Printf("Fetching books")

	rows, err := b.DB.Query(`SELECT title, author, year FROM book ORDER BY author ASC`)
	if err != nil {
		log.Fatalf("Unable to select book table:", err)
	}
	defer rows.Close()

	b.List = []Book{}
	var (
		title, author string
		year          int
	)

	for rows.Next() {
		err = rows.Scan(&title, &author, &year)
		if err != nil {
			log.Printf("Error: %v", err.Error())
		}
		b.List = append(b.List, Book{Title: title, Author: author, Year: year})
	}
}

func (b *Books) populate() {
	log.Printf("Recreating book table")

	_, err := b.DB.Query(`DROP TABLE book`)
	if err != nil {
		log.Printf("Unable to drop book table:", err)
	}

	_, err = b.DB.Query(`CREATE TABLE book
    (id serial primary key,
    title text NOT NULL,
    author varchar(255) NOT NULL,
    year smallint)`)
	if err != nil {
		log.Fatalf("Unable to create book table:", err)
	}

	log.Printf("Populating book table")

	for _, book := range seed {
		_, err = b.DB.Query(`INSERT INTO book (title, author, year) VALUES ($1,$2,$3)`, book.Title, book.Author, book.Year)
		if err != nil {
			log.Fatalf("Unable to populate book table:", err)
		}
	}
}
