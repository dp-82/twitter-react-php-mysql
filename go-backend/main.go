package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

const (
	ERR_CON       = "Connecting to MySQL failed"
	ERR_QUERY     = "Query Execution Failed"
	ERR_LOGIN     = "User details are wrong"
	SUCCESS_LOGIN = "User details are correct"
)

func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	// w.Header().Set("Content-Type", "application/json")
	// // w.Header().Set("Content-Type", "text/html; charset=utf-8")
	params := mux.Vars(r)
	uNameAndPWD := params["id"]
	var userName string = ""
	var password string = ""
	for i := 0; i < len(uNameAndPWD); i++ {
		if string(uNameAndPWD[i]) == "=" {
			for j := i + 1; j < len(uNameAndPWD); j++ {
				password = password + string(uNameAndPWD[j])
			}
			break
		}
		userName = userName + string(uNameAndPWD[i])
	}

	db, err := sql.Open("mysql", "root:password@tcp(172.17.0.2)/Twiier")

	if err != nil {
		json.NewEncoder(w).Encode(ERR_CON)
		return
	}
	defer db.Close()
	query := "SELECT username,password FROM users"

	result, err := db.Query(query)
	if err != nil {
		json.NewEncoder(w).Encode(ERR_QUERY)
		return
	}

	for result.Next() {
		var unmae, pwd string
		err := result.Scan(&unmae, &pwd)
		if err != nil {
			fmt.Println(err.Error())
		}
		if unmae == userName && pwd == password {
			json.NewEncoder(w).Encode(SUCCESS_LOGIN)
			return
		}
	}
	json.NewEncoder(w).Encode(ERR_LOGIN)
}

func main() {
	r := mux.NewRouter()

	// Route handles & endpoints
	r.HandleFunc("/login/{id}", loginHandler).Methods("GET")
	// Start server
	log.Fatal(http.ListenAndServe(":8282", r))
}
