package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

// Exoplanet is a simple record
type Exoplanet struct {
	Name                 string
	Mass, Period, Radius float64
}

// Exoplanets handles database interactions for lists of exoplanets
type Exoplanets struct {
	DB   *sql.DB
	List []Exoplanet
}

// fetch retrieves a fresh list from the database
func (b *Exoplanets) fetch() {
	if b.DB == nil {
		log.Println("Not connected to database")
		return
	}

	log.Printf("Fetching exoplanets")

	rows, err := b.DB.Query(`SELECT name, mass, period, radius FROM exoplanet ORDER BY name ASC`)
	if err != nil {
		log.Printf("Unable to select exoplanet table:", err)
		return
	}
	defer rows.Close()

	// clear the List and rebuild it from the returned rows
	b.List = []Exoplanet{}
	var (
		name                 string
		mass, period, radius float64
	)

	for rows.Next() {
		err = rows.Scan(&name, &mass, &period, &radius)
		if err != nil {
			log.Printf("Error: %v", err.Error())
		}
		b.List = append(b.List, Exoplanet{Name: name, Mass: mass, Period: period, Radius: radius})
	}
}

// populate creates and populates an exoplanet table from the seed
func (b *Exoplanets) populate() {
	if b.DB == nil {
		log.Println("Not connected to database")
		return
	}

	log.Printf("Recreating exoplanets table")

	// drop the table (in case it already exists)
	_, err := b.DB.Query(`DROP TABLE exoplanet`)
	if err != nil {
		log.Println("Unable to drop exoplanet table (may not exist)")
	}

	// create the exoplanet table
	_, err = b.DB.Query(`CREATE TABLE exoplanet
    (id serial primary key,
    name varchar(255),
    mass double precision,
		period double precision,
		radius double precision)`)
	if err != nil {
		log.Fatalf("Unable to create exoplanet table:", err)
	}

	// populate the table from the seed exoplanet list
	log.Printf("Populating exoplanet table")

	for _, p := range seed {
		_, err = b.DB.Query(`INSERT INTO exoplanet (name, mass, period, radius) VALUES ($1,$2,$3, $4)`, p.Name, p.Mass, p.Period, p.Radius)
		if err != nil {
			log.Fatalf("Unable to populate exoplanet table:", err)
		}
	}
}
