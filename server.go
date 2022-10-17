// local dev server
package main

import (
	"log"
	"net/http"
)

func main() {
	log.Println("Listening on :8082...")
	http.HandleFunc("/", serveFiles) // "/" matches everything (See ServeMux)
	log.Fatal(http.ListenAndServeTLS(":8082", "server.crt", "server.key", nil))
}

func serveFiles(w http.ResponseWriter, r *http.Request) {
	log.Printf("Request: %s\n", r.URL)

	var filePath = r.URL.Path[1:] //remove slash
	if filePath == "" {
		// On empty path display home/index (`test.html`)
		filePath = "index.html"
	}

	log.Printf("Serving: %s", filePath)
	http.ServeFile(w, r, filePath)
}
