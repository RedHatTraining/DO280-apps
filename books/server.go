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
	leak := [][]byte{}

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

	// WARNING! This endpoint is intentionally a memory leak for demonstration purposes.
	// We grab a large byte array and appends it to a global slice.
	r.HandleFunc("/leak", func(w http.ResponseWriter, r *http.Request) {
		leak = append(leak, make([]byte, 1<<24))
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "len: %d", len(leak))
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
