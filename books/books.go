package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

// Book is a simple record
type Book struct {
	Title, Author string
	Year          int
}

// Books handles database interactions for lists of books
type Books struct {
	DB   *sql.DB
	List []Book
}

// fetch retrieves a fresh list from the database
func (b *Books) fetch() {
	if b.DB == nil {
		log.Println("Not connected to database")
		return
	}

	log.Printf("Fetching books")

	rows, err := b.DB.Query(`SELECT title, author, year FROM book ORDER BY author ASC, year ASC`)
	if err != nil {
		log.Printf("Unable to select book table:", err)
		return
	}
	defer rows.Close()

	// clear the List and rebuild it from the returned rows
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

// populate creates and populates a book table from the seed
func (b *Books) populate() {
	if b.DB == nil {
		log.Println("Not connected to database")
		return
	}

	log.Printf("Recreating book table")

	// drop the table (in case it already exists)
	_, err := b.DB.Query(`DROP TABLE book`)
	if err != nil {
		log.Println("Unable to drop book table (may not exist)")
	}

	// create the book table
	_, err = b.DB.Query(`CREATE TABLE book
    (id serial primary key,
    title text NOT NULL,
    author varchar(255) NOT NULL,
    year smallint)`)
	if err != nil {
		log.Fatalf("Unable to create book table:", err)
	}

	// populate the table from the seed book list
	log.Printf("Populating book table")

	for _, book := range seed {
		_, err = b.DB.Query(`INSERT INTO book (title, author, year) VALUES ($1,$2,$3)`, book.Title, book.Author, book.Year)
		if err != nil {
			log.Fatalf("Unable to populate book table:", err)
		}
	}
}
