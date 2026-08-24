package main

import (
	"fmt"
	"os"
	"text/tabwriter"
	"vaultkey/internal/client"
)

func handleKeys() error {
	if len(os.Args) < 3 {
		return fmt.Errorf("missing keys subcommand\n%s", commandUsage["keys"])
	}
	sub := os.Args[2]

	switch sub {
	case "-h", "--help", "help":
		fmt.Print(commandUsage["keys"])
		return nil
	case "create":
		return handleCreateKey()
	case "list":
		return handleListKeys()
	case "revoke":
		return handleRevokeKey()
	default:
		return fmt.Errorf("unknown keys subcommand: %s\n%s", sub, commandUsage["keys"])
	}
}

func handleCreateKey() error {
	fs := newFlagSet("keys create")
	perm := fs.String("permissions", "read", "permissions: list|read|write|admin")
	proj := fs.String("project", "", "project scope (empty for all)")
	expiry := fs.String("expires", "", "RFC3339 expiration date (optional)")
	if err := fs.Parse(os.Args[3:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}
	name := args[0]

	c := client.NewClient()
	res, err := c.CreateAPIKey(name, *perm, *proj, *expiry)
	if err != nil {
		return err
	}

	fmt.Println("API Key created successfully!")
	fmt.Println("-----------------------------------------------------------------")
	fmt.Printf("ID:          %s\n", res.ID)
	fmt.Printf("Name:        %s\n", res.Name)
	fmt.Printf("Token:       %s\n", res.Token)
	fmt.Println("-----------------------------------------------------------------")
	fmt.Println("WARNING: Copy this token now! It will NEVER be shown again.")
	return nil
}

func handleListKeys() error {
	fs := newFlagSet("keys list")
	if err := fs.Parse(os.Args[3:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

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

func handleRevokeKey() error {
	fs := newFlagSet("keys revoke")
	if err := fs.Parse(os.Args[3:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}
	id := args[0]

	c := client.NewClient()
	if err := c.RevokeAPIKey(id); err != nil {
		return err
	}
	fmt.Printf("API Key %s revoked successfully.\n", id)
	return nil
}
