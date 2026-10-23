package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func handleInit() error {
	fs := newFlagSet("init")
	cwd, _ := os.Getwd()
	defaultProject := "default"
	if cwd != "" {
		base := filepath.Base(cwd)
		if base != "" && base != "." && base != "/" {
			defaultProject = base
		}
	}

	proj := fs.String("project", defaultProject, "project name for this workspace")
	env := fs.String("env", "development", "default environment for this workspace")
	server := fs.String("server", "", "optional VaultKey server address")
	force := fs.Bool("force", false, "overwrite existing .vaultkey.yaml if present")

	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	targetPath := ".vaultkey.yaml"
	if !*force {
		if _, err := os.Stat(targetPath); err == nil {
			return fmt.Errorf("%s already exists in this directory (use --force to overwrite)", targetPath)
		}
		if _, err := os.Stat("vaultkey.yaml"); err == nil {
			return fmt.Errorf("vaultkey.yaml already exists in this directory (use --force to overwrite)")
		}
	}

	var sb strings.Builder
	sb.WriteString("# VaultKey Workspace Configuration\n")
	sb.WriteString(fmt.Sprintf("project: %s\n", *proj))
	sb.WriteString(fmt.Sprintf("env: %s\n", *env))
	if *server != "" {
		sb.WriteString(fmt.Sprintf("server: %s\n", *server))
	}

	if err := os.WriteFile(targetPath, []byte(sb.String()), 0644); err != nil {
		return fmt.Errorf("failed to create %s: %w", targetPath, err)
	}

	fmt.Printf("Created %s with project=%q env=%q\n", targetPath, *proj, *env)
	fmt.Printf("CLI commands (pull, push, run, list, get) will now use these defaults automatically.\n")
	return nil
}
