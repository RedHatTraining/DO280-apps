package main

import (
	"database/sql"
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"time"
)

// FIXME: we shouldn't need to import db here...

var homeTemplate *template.Template

func init() {
	homeTemplate = template.Must(template.ParseFiles("template.html"))
}

func listenAndServe(port string, db *sql.DB) error {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		homeHandler(w, r, db)
	})
	r.HandleFunc("/healthz", healthzHandler)

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Printf("Listening on :%s", port)
	return srv.ListenAndServe()
}

func homeHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.WriteHeader(http.StatusOK)
	homeTemplate.Execute(w, getBooks(db))
}

func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "ok")
}
