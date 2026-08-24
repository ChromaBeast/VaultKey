package main

import (
	"encoding/json"
	"fmt"
	"os"
	"text/tabwriter"
	"vaultkey/internal/client"
)

func handleAudit() error {
	fs := newFlagSet("audit")
	limitFlag := fs.Int("limit", 50, "max entries to fetch (1..500)")
	offsetFlag := fs.Int("offset", 0, "entries to skip")
	jsonOut := fs.Bool("json", false, "print raw JSON entries")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	limit := *limitFlag
	if limit < 1 {
		limit = 1
	}
	if limit > 500 {
		limit = 500
	}
	offset := *offsetFlag
	if offset < 0 {
		offset = 0
	}

	c := client.NewClient()
	logs, err := c.ListAuditLogs(limit, offset)
	if err != nil {
		return err
	}

	if *jsonOut {
		data, err := json.MarshalIndent(logs, "", "  ")
		if err != nil {
			return err
		}
		fmt.Println(string(data))
		return nil
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

	verified, count, err := c.VerifyAuditChain()
	if err != nil {
		fmt.Printf("\n[WARNING] Audit chain verification failed: %v\n", err)
	} else if verified {
		fmt.Printf("\nOK: Chained HMAC signature integrity verified across all %d entries.\n", count)
	} else {
		fmt.Println("\nWARNING: Audit signature chain validation failed! Tampering detected!")
	}
	return nil
}
