package main

import (
	"fmt"
	"sort"
	"strings"
)

type dotenvEntry struct {
	Key   string
	Value string
}

func formatDotenv(secrets map[string]string) string {
	keys := make([]string, 0, len(secrets))
	for k := range secrets {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var sb strings.Builder
	for _, k := range keys {
		sb.WriteString(k)
		sb.WriteString("=")
		sb.WriteString(formatDotenvValue(secrets[k]))
		sb.WriteString("\n")
	}
	return sb.String()
}

func formatDotenvValue(v string) string {
	if !strings.ContainsAny(v, " \t#\"'\n\r$") {
		return v
	}
	s := strings.ReplaceAll(v, `\`, `\\`)
	s = strings.ReplaceAll(s, `"`, `\"`)
	s = strings.ReplaceAll(s, "\r\n", "\n")
	s = strings.ReplaceAll(s, "\r", "\n")
	s = strings.ReplaceAll(s, "\n", `\n`)
	return `"` + s + `"`
}

func parseDotenv(content string) ([]dotenvEntry, []error) {
	var entries []dotenvEntry
	var failures []error
	for i, line := range strings.Split(content, "\n") {
		line = strings.TrimSuffix(line, "\r")
		entry, err := parseDotenvLine(line, i+1)
		if err != nil {
			failures = append(failures, err)
			continue
		}
		if entry != nil {
			entries = append(entries, *entry)
		}
	}
	return entries, failures
}

func parseDotenvLine(line string, lineNo int) (*dotenvEntry, error) {
	trimmed := strings.TrimSpace(line)
	if trimmed == "" || strings.HasPrefix(trimmed, "#") {
		return nil, nil
	}
	if rest, ok := strings.CutPrefix(trimmed, "export "); ok {
		trimmed = strings.TrimSpace(rest)
	}
	eq := strings.Index(trimmed, "=")
	if eq <= 0 {
		return nil, fmt.Errorf("line %d: expected KEY=VALUE", lineNo)
	}
	key := strings.TrimSpace(trimmed[:eq])
	value := strings.TrimSpace(trimmed[eq+1:])
	if !validEnvKey(key) {
		return nil, fmt.Errorf("line %d: invalid key %q", lineNo, key)
	}

	parsed, err := parseDotenvValue(value, lineNo)
	if err != nil {
		return nil, err
	}
	return &dotenvEntry{Key: key, Value: parsed}, nil
}

func validEnvKey(key string) bool {
	for i, r := range key {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r == '_':
		case r >= '0' && r <= '9':
			if i == 0 {
				return false
			}
		case r == '.':
			if i == 0 {
				return false
			}
		default:
			return false
		}
	}
	return len(key) > 0
}

func parseDotenvValue(value string, lineNo int) (string, error) {
	if value == "" {
		return "", nil
	}
	switch value[0] {
	case '"':
		return parseQuoted(value, '"', true, lineNo)
	case '\'':
		return parseQuoted(value, '\'', false, lineNo)
	default:
		return stripInlineComment(value), nil
	}
}

func parseQuoted(value string, quote byte, unescape bool, lineNo int) (string, error) {
	inner := ""
	if len(value) >= 2 && value[len(value)-1] == quote {
		inner = value[1 : len(value)-1]
	} else {
		end := indexClosingQuote(value, quote)
		if end < 0 {
			return "", fmt.Errorf("line %d: unterminated %c quote", lineNo, quote)
		}
		rest := strings.TrimSpace(value[end+1:])
		if !strings.HasPrefix(rest, "#") {
			return "", fmt.Errorf("line %d: unexpected content after closing %c quote", lineNo, quote)
		}
		inner = value[1:end]
	}
	if unescape {
		return unescapeDouble(inner), nil
	}
	return inner, nil
}

func indexClosingQuote(value string, quote byte) int {
	for i := 1; i < len(value); i++ {
		if value[i] == '\\' {
			i++
			continue
		}
		if value[i] == quote {
			return i
		}
	}
	return -1
}

func unescapeDouble(s string) string {
	var sb strings.Builder
	for i := 0; i < len(s); i++ {
		if s[i] == '\\' && i+1 < len(s) {
			i++
			switch s[i] {
			case 'n':
				sb.WriteByte('\n')
			case 't':
				sb.WriteByte('\t')
			case 'r':
				sb.WriteByte('\r')
			default:
				sb.WriteByte(s[i])
			}
			continue
		}
		sb.WriteByte(s[i])
	}
	return sb.String()
}

func stripInlineComment(value string) string {
	if idx := strings.Index(value, " #"); idx >= 0 {
		return strings.TrimSpace(value[:idx])
	}
	if idx := strings.Index(value, "\t#"); idx >= 0 {
		return strings.TrimSpace(value[:idx])
	}
	return value
}
