package main

import (
	"flag"
	"fmt"
	"time"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var port string

func init() {
	flag.StringVar(&port, "p", "8080", "Port to listen on")
	flag.StringVar(&port, "port", "8080", "Port to listen on")
}

func main() {
	flag.Parse()

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
	fmt.Fprint(w, "hello")
}

func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "ok")
}
