package main

import (
	"fmt"
	"log"
	"os"
	"vaultkey"
	"vaultkey/internal/api"
	"vaultkey/internal/config"
	"vaultkey/internal/db"
)

func main() {
	cfgPath := "vaultkey.yaml"
	if len(os.Args) > 1 {
		cfgPath = os.Args[1]
	}

	cfg, err := config.Load(cfgPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	database, err := db.Open(cfg.DatabasePath)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer database.Close()

	fmt.Printf("Starting VaultKey REST API Server on port %d...\n", cfg.Port)
	server := api.NewServer(cfg, database, vaultkey.WebFS)
	if err := server.Start(); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}
