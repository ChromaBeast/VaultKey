package main

import (
	"fmt"
	"os"
	"vaultkey/internal/client"
)

func handlePull() error {
	fs := newFlagSet("pull")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	outFile := fs.String("out", ".env", "output file path")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	c := client.NewClient()
	secrets, err := c.BatchGetSecrets(*proj, *env)
	if err != nil {
		return err
	}

	if err := os.WriteFile(*outFile, []byte(formatDotenv(secrets)), 0600); err != nil {
		return fmt.Errorf("failed to write %s: %w", *outFile, err)
	}

	fmt.Printf("Successfully pulled %d secrets into %s!\n", len(secrets), *outFile)
	return nil
}

func handlePush() error {
	fs := newFlagSet("push")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	inFile := fs.String("file", ".env", "input .env file path")
	dryRun := fs.Bool("dry-run", false, "parse and validate without pushing")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	content, err := os.ReadFile(*inFile)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", *inFile, err)
	}

	entries, parseFailures := parseDotenv(string(content))
	for _, perr := range parseFailures {
		fmt.Fprintf(os.Stderr, "%s: %v\n", *inFile, perr)
	}
	if len(entries) == 0 && len(parseFailures) > 0 {
		return fmt.Errorf("no valid entries found in %s", *inFile)
	}

	if *dryRun {
		fmt.Printf("Dry run: %d entries parsed successfully from %s:\n", len(entries), *inFile)
		for _, e := range entries {
			fmt.Printf("  %s\n", e.Key)
		}
		if len(parseFailures) > 0 {
			return fmt.Errorf("%d line(s) failed validation", len(parseFailures))
		}
		return nil
	}

	c := client.NewClient()
	failed := 0
	for _, e := range entries {
		if err := c.CreateSecret(e.Key, e.Value, *proj, *env); err != nil {
			failed++
			fmt.Fprintf(os.Stderr, "Failed to push %s: %v\n", e.Key, err)
		}
	}

	if failed > 0 {
		return fmt.Errorf("%d of %d entries failed to push from %s", failed, len(entries), *inFile)
	}
	fmt.Printf("Successfully pushed %d secrets from %s to VaultKey!\n", len(entries), *inFile)
	return nil
}
