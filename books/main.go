package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

const port = "8080"

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

var homeTemplate *template.Template

func main() {
	homeTemplate = template.Must(template.ParseFiles("template.html"))

	r := mux.NewRouter()
	r.HandleFunc("/", homeHandler)
	r.HandleFunc("/healthz", healthzHandler)

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Printf("Listening on :%s", port)
	log.Fatal(srv.ListenAndServe())
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	homeTemplate.Execute(w, books)
}

func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "ok")
}
