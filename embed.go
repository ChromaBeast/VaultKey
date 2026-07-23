package vaultkey

import "embed"

// WebFS embeds the compiled static frontend files.
//
//go:embed web/dist/*
var WebFS embed.FS
