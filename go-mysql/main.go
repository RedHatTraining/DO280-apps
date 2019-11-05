package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
)

// Global variables

var username, password, database, host string
var DB *sql.DB

type User struct {
	ID       int
	Username string
	Password string
}

func main() {
	username, _ = os.LookupEnv("MYSQL_USER")
	password, _ = os.LookupEnv("MYSQL_PASSWORD")
	database, _ = os.LookupEnv("MYSQL_DATABASE")
	host, _ = os.LookupEnv("MYSQL_HOST")
	DB = db_connect(username, password, database, host)
	defer DB.Close()
	Setup()

	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/get", HomeHandler)
	r.HandleFunc("/add", AddHandler)
	r.HandleFunc("/env", EnvHandler)
	http.Handle("/", r)
	log.Printf("Starting Application\nServices:\n/\n/get\n/add")
	log.Fatal(http.ListenAndServe(":8000", r))
}

// Handlers

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("layout.html"))
	err := DB.Ping()
	if err != nil {
		panic(err.Error())
	}
	users := get_data()
	next := users[len(users)-1].ID + 1
	data := struct {
		Users []User
		Next  int
	}{
		users,
		next,
	}
	err = tmpl.Execute(w, data)
	if err != nil {
		log.Printf("Error while executing template: %s", err)
	}
}

func EnvHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("layout.html"))
	data := struct {
		MYSQL_USER     string
		MYSQL_PASSWORD string
		MYSQL_DATABASE string
		MYSQL_HOST     string
		Users          []User
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
	log.Printf("Database Setup Variables:\nMYSQL_USER: %s\nMYSQL_PASSWORD: %s\nMYSQL_DATABASE: %s\nMYSQL_HOST: %s\n", username, password, database, host)

}

func AddHandler(w http.ResponseWriter, r *http.Request) {
	i, _ := strconv.Atoi(r.FormValue("id"))
	u := r.FormValue("username")
	p := r.FormValue("password")
	insert_data(User{
		ID:       i,
		Username: u,
		Password: p,
	})
	log.Printf("New user added\n")
	http.Redirect(w, r, "http://localhost:8000/", http.StatusFound)
}

func Setup() {
	log.Print("Creating schema")
	db_create_schema()
	log.Printf("Database Setup Completed\n")
	insert_data(User{
		ID:       1,
		Username: "FirstUser",
		Password: "FirstPass",
	})

}

// Data functions

func db_create_schema() {
	crt, err := DB.Prepare("CREATE TABLE test_mysql (id int NOT NULL AUTO_INCREMENT, username varchar(20), password varchar(20), CONSTRAINT id_pk PRIMARY KEY (id))")
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
		panic(err.Error())
	}
	return db
}

func insert_data(user User) {
	stmtIns, err := DB.Prepare("INSERT INTO test_mysql VALUES( ?, ?, ? )")
	if err != nil {
		panic(err.Error())
	}
	stmtIns.Exec(user.ID, user.Username, user.Password)
	log.Printf("Data added\n")
	stmtIns.Close()

}

func get_data() []User {
	var id int
	var username string
	var password string
	var users []User
	rows, err := DB.Query("SELECT id, username, password FROM test_mysql order by id asc")
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&id, &username, &password)
		if err != nil {
			log.Printf("Error: %v", err.Error())
		}
		users = append(users, User{ID: id, Username: username, Password: password})
		log.Printf("Users: %d", len(users))
	}
	return users
}
