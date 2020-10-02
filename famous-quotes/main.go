package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"os"
)

// Global variables

var username, password, database, host string
var DB *sql.DB

type Quote struct {
	ID      int
	Message string
}

func main() {
	username, _ = os.LookupEnv("QUOTES_USER")
	password, _ = os.LookupEnv("QUOTES_PASSWORD")
	database, _ = os.LookupEnv("QUOTES_DATABASE")
	host, _ = os.LookupEnv("QUOTES_HOSTNAME")
	DB = db_connect(username, password, database, host)
	if DB == nil {
		log.Printf("Could not connect to the databse: %s", database)
	}
	defer DB.Close()
	setup()

	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/random", RandHandler)
	r.HandleFunc("/env", EnvHandler)
	r.HandleFunc("/status", StatusHandler)
	http.Handle("/", r)
	log.Printf("Starting Application\nServices:\n/\n/random\n/env\n/status")
	log.Fatal(http.ListenAndServe(":8000", r))
}

// Handlers

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("layout.html"))
	quotes := get_all_quotes()
	data := struct {
		Quotes []Quote
	}{
		quotes,
	}
	err := tmpl.Execute(w, data)
	if err != nil {
		log.Printf("Error while executing template: %s", err)
	}
}

func RandHandler(w http.ResponseWriter, r *http.Request) {
	quote := get_random_quote()
	fmt.Fprintf(w, "%d: %s", quote.ID, quote.Message)
}

func StatusHandler(w http.ResponseWriter, r *http.Request) {
	err := DB.Ping()
	if err != nil {
		fmt.Fprintf(w, "Database connection error: %s", err)
	} else {
		fmt.Fprintf(w, "Database connection OK\n")
	}
}

func EnvHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("layout.html"))
	data := struct {
		QUOTES_USER     string
		QUOTES_PASSWORD string
		QUOTES_DATABASE string
		QUOTES_HOST     string
		Quotes          []Quote
	}{
		username,
		password,
		database,
		host,
		nil,
	}
	err := tmpl.Execute(w, data)
	if err != nil {
		log.Printf("Error while executing template: %s", err)
	}
	log.Printf("Database Setup Variables:\nQUOTES_USER: %s\nQUOTES_PASSWORD: %s\nQUOTES_DATABASE: %s\nQUOTES_HOST: %s\n", username, password, database, host)

}

// Data functions

func setup() {
	var rows string
	var messages = []string{
		"When words fail, music speaks.\n- William Shakespeare\n",
		"Happiness depends upon ourselves.\n- Aristotle\n",
		"The secret of change is to focus all your energy not on fighting the old but on building the new.\n- Socrates\n",
		"Nothing that glitters is gold.\n- Mark Twain",
		"Imagination is more important than knowledge.\n- Albert Einstein\n",
		"Hell, if I could explain it to the average person, it wouldn't have been worth the Nobel prize.\n- Richard Feynman\n",
		"Young man, in mathematics you don't understand things. You just get used to them.\n- John von Neumann\n",
		"Those who can imagine anything, can create the impossible.\n- Alan Turing\n",
	}

	// Check if the databse connection is active
	err := DB.Ping()
	if err != nil {
		log.Fatalf("Database connection error: %s", err)
	} else {
		log.Printf("Database connection OK\n")
	}

	// Get table rows to check if there's data already
	err = DB.QueryRow("SELECT count(*) FROM quotes").Scan(&rows)
	if err == nil && rows != "0" {
		log.Printf("Database already setup, ignoring")
		return
	}

	log.Print("Creating schema")
	db_create_schema()
	log.Print("Adding quotes")
	for _, s := range messages {
		insert_data(s)
	}
	log.Printf("Database Setup Completed\n")
}

func db_create_schema() {
	crt, err := DB.Prepare("CREATE TABLE quotes (id int NOT NULL AUTO_INCREMENT, message text, CONSTRAINT id_pk PRIMARY KEY (id))")
	if err != nil {
		log.Printf("Error preparing the database creation: %s", err)
	}
	_, err = crt.Exec()
	if err != nil {
		log.Printf("Error creating the database: %s", err)
	}
	crt.Close()
}

func db_connect(username string, password string, database string, host string) *sql.DB {
	connstring := username + ":" + password + "@tcp(" + host + ":3306)/" + database
	log.Print("Connecting to the database: " + connstring)
	db, err := sql.Open("mysql", connstring)
	if err != nil {
		log.Printf("Error preparing database connection:%s", err.Error())
		return nil
	}

	return db
}

func insert_data(message string) {
	stmtIns, err := DB.Prepare("INSERT INTO quotes (message) VALUES( ? )")
	log.Printf("Adding quote: %s", message)
	if err != nil {
		panic(err.Error())
	}

	_, err = stmtIns.Exec(message)
	if err != nil {
		panic(err.Error())
	}
	stmtIns.Close()

}

func get_all_quotes() []Quote {
	var id int
	var message string
	var quotes []Quote
	rows, err := DB.Query("SELECT id, message FROM quotes order by id asc")
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&id, &message)
		if err != nil {
			log.Printf("Error: %v", err.Error())
		}
		quotes = append(quotes, Quote{ID: id, Message: message})
	}
	return quotes
}

func get_random_quote() Quote {
	var id int
	var message string
	err := DB.QueryRow("SELECT id, message FROM quotes order by RAND() LIMIT 1").Scan(&id, &message)
	if err != nil {
		log.Printf("Error: %v", err.Error())
	}

	log.Printf("Quote: %s", message)
	return Quote{ID: id, Message: message}
}
