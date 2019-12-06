package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

var homeTemplate *template.Template

func init() {
	homeTemplate = template.Must(template.ParseFiles("template.html"))
}

func listenAndServe(port string) error {
	r := mux.NewRouter()
	r.HandleFunc("/", homeHandler)
	r.HandleFunc("/healthz", healthzHandler)

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	log.Printf("listening on :%s", port)
	return srv.ListenAndServe()
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	homeTemplate.Execute(w, books)
}

func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "ok")
}
