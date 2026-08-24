package main

import (
	"fmt"
	"os"
	"strings"
	"syscall"
	"text/tabwriter"
	"vaultkey/internal/client"

	"golang.org/x/term"
)

func handleSet() error {
	fs := newFlagSet("set")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 2)
	if err != nil {
		return err
	}
	key := args[0]

	var val string
	if len(args) == 2 {
		val = args[1]
	} else {
		fmt.Printf("Enter value for %s: ", key)
		byteValue, err := term.ReadPassword(int(syscall.Stdin))
		if err != nil {
			return fmt.Errorf("failed to read value: %w", err)
		}
		fmt.Println()
		val = strings.TrimRight(string(byteValue), "\r\n")
		clear(byteValue)
	}

	c := client.NewClient()
	if err := c.SetSecret(*proj, *env, key, val); err != nil {
		return err
	}
	fmt.Printf("Secret %s stored successfully inside %s/%s.\n", key, *proj, *env)
	return nil
}

func handleList() error {
	fs := newFlagSet("list")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	c := client.NewClient()
	list, err := c.ListSecrets(*proj, *env)
	if err != nil {
		return err
	}

	if len(list) == 0 {
		fmt.Printf("No secrets found in %s/%s.\n", *proj, *env)
		return nil
	}

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 3, ' ', 0)
	fmt.Fprintln(w, "KEY\tPROJECT\tENVIRONMENT\tVERSION\tCREATED BY")
	for _, item := range list {
		fmt.Fprintf(w, "%s\t%s\t%s\t%d\t%s\n", item.Key, item.Project, item.Env, item.Version, item.CreatedBy)
	}
	w.Flush()
	return nil
}

func handleExport() error {
	fs := newFlagSet("export")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	format := fs.String("format", "dotenv", "export format (dotenv)")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}
	if *format != "dotenv" {
		return fmt.Errorf("unsupported export format %q: only \"dotenv\" is supported\n%s", *format, commandUsage["export"])
	}

	c := client.NewClient()
	secrets, err := c.BatchGetSecrets(*proj, *env)
	if err != nil {
		return err
	}

	fmt.Print(formatDotenv(secrets))
	return nil
}
