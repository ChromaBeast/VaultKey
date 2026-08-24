package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
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

	if err := cfg.Validate(); err != nil {
		log.Fatalf("Configuration rejected: %v", err)
	}

	database, err := db.Open(cfg.DatabasePath)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer database.Close()

	fmt.Printf("Starting VaultKey REST API Server on port %d (env=%s)...\n", cfg.Port, cfg.Environment)
	server := api.NewServer(cfg, database, vaultkey.WebFS)

	errCh := make(chan error, 1)
	go func() {
		errCh <- server.Start()
	}()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-sigCh:
		fmt.Printf("Received %s, shutting down gracefully...\n", sig)
		if err := server.Shutdown(); err != nil {
			log.Printf("graceful shutdown failed: %v", err)
		}
	case err := <-errCh:
		if err != nil {
			log.Fatalf("Server startup failed: %v", err)
		}
	}
}
