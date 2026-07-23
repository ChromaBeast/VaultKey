package main

import (
	"flag"
	"fmt"
	"os"
	"text/tabwriter"
	"vaultkey/internal/client"
)

// handleKeys routes subcommands for api-keys management.
func handleKeys() error {
	if len(os.Args) < 3 {
		return fmt.Errorf("missing keys subcommand. Usage: vaultkey keys <create|list|revoke> [args]")
	}
	sub := os.Args[2]

	switch sub {
	case "create":
		return handleCreateKey()
	case "list":
		return handleListKeys()
	case "revoke":
		return handleRevokeKey()
	default:
		return fmt.Errorf("unknown keys subcommand: %s", sub)
	}
}

// handleCreateKey generates and prints the newly created key credentials.
func handleCreateKey() error {
	fs := flag.NewFlagSet("keys create", flag.ContinueOnError)
	perm := fs.String("permissions", "read", "permissions: list|read|write|admin")
	proj := fs.String("project", "", "project scope (empty for all)")
	expiry := fs.String("expires", "", "RFC3339 expiration date (optional)")
	if err := fs.Parse(os.Args[3:]); err != nil {
		return err
	}
	if len(fs.Args()) < 1 {
		return fmt.Errorf("missing key name. Usage: vaultkey keys create <name>")
	}
	name := fs.Arg(0)

	c := client.NewClient()
	res, err := c.CreateAPIKey(name, *perm, *proj, *expiry)
	if err != nil {
		return err
	}

	fmt.Println("✓ API Key created successfully!")
	fmt.Println("-----------------------------------------------------------------")
	fmt.Printf("ID:          %s\n", res.ID)
	fmt.Printf("Name:        %s\n", res.Name)
	fmt.Printf("Token:       %s\n", res.Token)
	fmt.Println("-----------------------------------------------------------------")
	fmt.Println("WARNING: Copy this token now! It will NEVER be shown again.")
	return nil
}

// handleListKeys prints all key records.
func handleListKeys() error {
	c := client.NewClient()
	list, err := c.ListAPIKeys()
	if err != nil {
		return err
	}

	if len(list) == 0 {
		fmt.Println("No API keys found.")
		return nil
	}

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "ID\tNAME\tPERMISSIONS\tPROJECT\tACTIVE\tEXPIRES AT")
	for _, k := range list {
		proj := "all"
		if k.Project != nil {
			proj = *k.Project
		}
		active := "no"
		if k.Active {
			active = "yes"
		}
		expires := "never"
		if k.ExpiresAt != nil {
			expires = *k.ExpiresAt
		}
		fmt.Fprintf(w, "%s\t%s\t%s\t%s\t%s\t%s\n", k.ID, k.Name, k.Permissions, proj, active, expires)
	}
	w.Flush()
	return nil
}

// handleRevokeKey revokes API access.
func handleRevokeKey() error {
	fs := flag.NewFlagSet("keys revoke", flag.ContinueOnError)
	if err := fs.Parse(os.Args[3:]); err != nil {
		return err
	}
	if len(fs.Args()) < 1 {
		return fmt.Errorf("missing key ID. Usage: vaultkey keys revoke <id>")
	}
	id := fs.Arg(0)

	c := client.NewClient()
	if err := c.RevokeAPIKey(id); err != nil {
		return err
	}
	fmt.Printf("API Key %s revoked successfully.\n", id)
	return nil
}
