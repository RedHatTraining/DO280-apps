package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"time"
)

var homeTemplate *template.Template

func init() {
	homeTemplate = template.Must(template.ParseFiles("template.html"))
}

func listenAndServe(port string, books *Books) error {
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		books.fetch()
		w.WriteHeader(http.StatusOK)
		homeTemplate.Execute(w, books.List)
	})

	r.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "ok")
	})

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Printf("Listening on :%s", port)
	return srv.ListenAndServe()
}
