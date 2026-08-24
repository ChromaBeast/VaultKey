package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"vaultkey/internal/client"
)

func handleRun() error {
	fs := newFlagSet("run")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}

	remaining := fs.Args()
	if len(remaining) == 0 {
		return fmt.Errorf("missing command to execute\n%s", commandUsage["run"])
	}

	c := client.NewClient()
	secrets, err := c.BatchGetSecrets(*proj, *env)
	if err != nil {
		return fmt.Errorf("failed to fetch secrets: %w", err)
	}

	envVars := os.Environ()
	for k, v := range secrets {
		envVars = append(envVars, fmt.Sprintf("%s=%s", k, v))
	}

	childCmd := remaining[0]
	childArgs := remaining[1:]

	cmd := exec.Command(childCmd, childArgs...)
	cmd.Env = envVars
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		var ee *exec.ExitError
		if errors.As(err, &ee) {
			return &exitError{code: ee.ExitCode()}
		}
		return err
	}
	return nil
}
