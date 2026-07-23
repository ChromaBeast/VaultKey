package main

import (
	"flag"
	"fmt"
	"os"
	"text/tabwriter"
	"vaultkey/internal/client"
)

// handleSet encrypts and stores a secret.
func handleSet() error {
	fs := flag.NewFlagSet("set", flag.ContinueOnError)
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if len(fs.Args()) < 2 {
		return fmt.Errorf("missing key or value. Usage: vaultkey set <key> <value>")
	}
	key := fs.Arg(0)
	val := fs.Arg(1)

	c := client.NewClient()
	if err := c.SetSecret(*proj, *env, key, val); err != nil {
		return err
	}
	fmt.Printf("Secret %s stored successfully inside %s/%s.\n", key, *proj, *env)
	return nil
}

// handleList lists all secret metadata in a tabular format.
func handleList() error {
	fs := flag.NewFlagSet("list", flag.ContinueOnError)
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
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

// handleExport dumps secrets to a dotenv file format structure.
func handleExport() error {
	fs := flag.NewFlagSet("export", flag.ContinueOnError)
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	format := fs.String("format", "dotenv", "export format (dotenv)")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}

	c := client.NewClient()
	list, err := c.ListSecrets(*proj, *env)
	if err != nil {
		return err
	}

	for _, item := range list {
		val, err := c.GetSecret(*proj, *env, item.Key)
		if err != nil {
			return err
		}
		if *format == "dotenv" {
			fmt.Printf("%s=%s\n", item.Key, val)
		}
	}
	return nil
}

// handleAudit retrieves log entries and prints verification stats.
func handleAudit() error {
	c := client.NewClient()

	logs, err := c.ListAuditLogs(50, 0)
	if err != nil {
		return err
	}

	if len(logs) == 0 {
		fmt.Println("No audit entries logged.")
		return nil
	}

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "ACTION\tACTOR\tSECRET KEY\tPROJECT\tTIMESTAMP")
	for _, e := range logs {
		sKey := "-"
		if e.SecretKey != nil {
			sKey = *e.SecretKey
		}
		proj := "-"
		if e.Project != nil {
			proj = *e.Project
		}

		fmt.Fprintf(w, "%s\t%s\t%s\t%s\t%s\n", e.Action, e.Actor, sKey, proj, e.CreatedAt.Format("2006-01-02 15:04:05"))
	}
	w.Flush()

	// Verify whole signature chain
	verified, count, err := c.VerifyAuditChain()
	if err != nil {
		fmt.Printf("\n[WARNING] Audit chain verification failed: %v\n", err)
	} else if verified {
		fmt.Printf("\n✓ Chained HMAC signature integrity verified across all %d entries.\n", count)
	} else {
		fmt.Println("\n❌ WARNING: Audit signature chain validation failed! Tampering detected!")
	}
	return nil
}
