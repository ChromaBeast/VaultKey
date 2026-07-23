package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"vaultkey/internal/client"
)

func handlePull() error {
	c := client.NewClient()
	proj := "default"
	env := "production"
	outFile := ".env"

	for _, arg := range os.Args[2:] {
		if strings.HasPrefix(arg, "--project=") {
			proj = strings.TrimPrefix(arg, "--project=")
		} else if strings.HasPrefix(arg, "--env=") {
			env = strings.TrimPrefix(arg, "--env=")
		} else if strings.HasPrefix(arg, "--out=") {
			outFile = strings.TrimPrefix(arg, "--out=")
		}
	}

	secrets, err := c.BatchGetSecrets(proj, env)
	if err != nil {
		return err
	}

	var sb strings.Builder
	for k, v := range secrets {
		sb.WriteString(fmt.Sprintf("%s=%s\n", k, v))
	}

	if err := os.WriteFile(outFile, []byte(sb.String()), 0600); err != nil {
		return fmt.Errorf("failed to write %s: %w", outFile, err)
	}

	fmt.Printf("Successfully pulled %d secrets into %s!\n", len(secrets), outFile)
	return nil
}

func handlePush() error {
	c := client.NewClient()
	proj := "default"
	env := "production"
	inFile := ".env"

	for _, arg := range os.Args[2:] {
		if strings.HasPrefix(arg, "--project=") {
			proj = strings.TrimPrefix(arg, "--project=")
		} else if strings.HasPrefix(arg, "--env=") {
			env = strings.TrimPrefix(arg, "--env=")
		} else if strings.HasPrefix(arg, "--file=") {
			inFile = strings.TrimPrefix(arg, "--file=")
		}
	}

	file, err := os.Open(inFile)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", inFile, err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	count := 0
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			k := strings.TrimSpace(parts[0])
			v := strings.TrimSpace(parts[1])
			v = strings.Trim(v, `"'`)
			if err := c.CreateSecret(k, v, proj, env); err != nil {
				fmt.Printf("Failed to push %s: %v\n", k, err)
			} else {
				count++
			}
		}
	}

	fmt.Printf("Successfully pushed %d secrets from %s to VaultKey!\n", count, inFile)
	return nil
}
