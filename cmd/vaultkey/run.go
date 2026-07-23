package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"
	"vaultkey/internal/client"
)

// handleRun retrieves all decrypted secrets and spawns the target child command with injected env variables in-memory.
func handleRun() error {
	fs := flag.NewFlagSet("run", flag.ContinueOnError)
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}

	remaining := fs.Args()
	if len(remaining) == 0 {
		return fmt.Errorf("missing command to execute. Usage: vaultkey run [--project=p] [--env=e] -- <cmd> [args...]")
	}

	c := client.NewClient()
	list, err := c.ListSecrets(*proj, *env)
	if err != nil {
		return fmt.Errorf("failed to fetch secrets list: %w", err)
	}

	// Copy parent environment and append decrypted secrets
	envVars := os.Environ()
	for _, item := range list {
		val, err := c.GetSecret(*proj, *env, item.Key)
		if err != nil {
			return fmt.Errorf("failed to decrypt secret %s: %w", item.Key, err)
		}
		envVars = append(envVars, fmt.Sprintf("%s=%s", item.Key, val))
	}

	childCmd := remaining[0]
	childArgs := remaining[1:]

	cmd := exec.Command(childCmd, childArgs...)
	cmd.Env = envVars
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("child process exited with error: %w", err)
	}
	return nil
}
