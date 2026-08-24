package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"text/tabwriter"
	"time"

	"vaultkey/internal/client"
)

func handleDelete() error {
	fs := newFlagSet("delete")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}
	key := args[0]

	fmt.Print("Type the key name to confirm: ")
	line, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && line == "" {
		return fmt.Errorf("failed to read confirmation: %w", err)
	}
	if strings.TrimRight(line, "\r\n") != key {
		return fmt.Errorf("confirmation mismatch, aborting delete of %s", key)
	}

	c := client.NewClient()
	if err := c.DeleteSecret(*proj, *env, key); err != nil {
		return err
	}
	fmt.Printf("Secret %s deleted from %s/%s.\n", key, *proj, *env)
	return nil
}

func handleVersions() error {
	fs := newFlagSet("versions")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}

	c := client.NewClient()
	list, err := c.ListSecretVersions(*proj, *env, args[0])
	if err != nil {
		return err
	}
	if len(list) == 0 {
		fmt.Printf("No versions found for %s in %s/%s.\n", args[0], *proj, *env)
		return nil
	}

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 3, ' ', 0)
	fmt.Fprintln(w, "VERSION\tCREATED AT\tVALUE")
	for _, v := range list {
		fmt.Fprintf(w, "%d\t%s\t%s\n", v.Version, v.CreatedAt.Format(time.RFC3339), v.Value)
	}
	w.Flush()
	return nil
}

func handleRollback() error {
	fs := newFlagSet("rollback")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	version := fs.Int("version", 0, "target version to restore (required)")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}
	if *version <= 0 {
		return fmt.Errorf("--version N is required and must be positive\n%s", commandUsage["rollback"])
	}

	c := client.NewClient()
	newVersion, err := c.RollbackSecret(*proj, *env, args[0], *version)
	if err != nil {
		return err
	}
	fmt.Printf("Secret %s rolled back to version %d (now version %d).\n", args[0], *version, newVersion)
	return nil
}

func handleProjects() error {
	fs := newFlagSet("projects")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	c := client.NewClient()
	list, err := c.ListProjects()
	if err != nil {
		return err
	}
	if len(list) == 0 {
		fmt.Println("No projects found.")
		return nil
	}
	for _, p := range list {
		fmt.Println(p)
	}
	return nil
}
