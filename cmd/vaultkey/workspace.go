package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

// WorkspaceConfig holds project-level defaults for the VaultKey CLI.
type WorkspaceConfig struct {
	Project     string `yaml:"project"`
	Env         string `yaml:"env"`
	Environment string `yaml:"environment"` // alias for env
	Server      string `yaml:"server"`
	FilePath    string `yaml:"-"`
}

// FindWorkspaceConfigFile searches for .vaultkey.yaml or vaultkey.yaml
// starting in startDir and traversing upwards to filesystem root.
func FindWorkspaceConfigFile(startDir string) (string, error) {
	if startDir == "" {
		var err error
		startDir, err = os.Getwd()
		if err != nil {
			return "", err
		}
	}

	curr := filepath.Clean(startDir)
	for {
		// 1. Prefer hidden .vaultkey.yaml
		dotPath := filepath.Join(curr, ".vaultkey.yaml")
		if info, err := os.Stat(dotPath); err == nil && !info.IsDir() {
			return dotPath, nil
		}

		// 2. Check vaultkey.yaml
		plainPath := filepath.Join(curr, "vaultkey.yaml")
		if info, err := os.Stat(plainPath); err == nil && !info.IsDir() {
			return plainPath, nil
		}

		parent := filepath.Dir(curr)
		if parent == curr {
			// Reached filesystem root
			break
		}
		curr = parent
	}

	return "", os.ErrNotExist
}

// LoadWorkspaceConfig discovers and loads the nearest workspace config.
// If not found or if fields are empty, safe defaults ("default" / "production") are returned.
func LoadWorkspaceConfig() WorkspaceConfig {
	cfg := WorkspaceConfig{
		Project: "default",
		Env:     "production",
	}

	cfgPath, err := FindWorkspaceConfigFile("")
	if err != nil {
		return cfg
	}

	data, err := os.ReadFile(cfgPath)
	if err != nil {
		return cfg
	}

	var parsed WorkspaceConfig
	if err := yaml.Unmarshal(data, &parsed); err != nil {
		return cfg
	}

	parsed.FilePath = cfgPath

	if strings.TrimSpace(parsed.Project) != "" {
		cfg.Project = strings.TrimSpace(parsed.Project)
	}

	envVal := strings.TrimSpace(parsed.Env)
	if envVal == "" {
		envVal = strings.TrimSpace(parsed.Environment)
	}
	if envVal != "" {
		cfg.Env = envVal
	}

	if strings.TrimSpace(parsed.Server) != "" {
		cfg.Server = strings.TrimSpace(parsed.Server)
		if os.Getenv("VAULTKEY_SERVER") == "" {
			_ = os.Setenv("VAULTKEY_SERVER", cfg.Server)
		}
	}

	cfg.FilePath = cfgPath
	return cfg
}

// CheckGitIgnore checks whether targetPath is ignored by git.
// It first attempts `git check-ignore -q`. If git is absent or not in a git repo,
// it falls back to inspecting .gitignore files in targetPath's directory or parents.
func CheckGitIgnore(targetPath string) (bool, error) {
	absTarget, err := filepath.Abs(targetPath)
	if err != nil {
		absTarget = targetPath
	}
	targetDir := filepath.Dir(absTarget)
	targetBase := filepath.Base(absTarget)

	// Try native git command first inside target's directory
	cmd := exec.Command("git", "check-ignore", "-q", targetBase)
	cmd.Dir = targetDir
	if err := cmd.Run(); err == nil {
		// Exit code 0 means git is ignoring this file
		return true, nil
	} else if exitErr, ok := err.(*exec.ExitError); ok && exitErr.ExitCode() == 1 {
		// Exit code 1 means git ran successfully and explicitly confirmed target is NOT ignored
		return false, nil
	}

	// Fallback heuristic: check .gitignore in dir and ancestors
	dir := targetDir
	for {
		giPath := filepath.Join(dir, ".gitignore")
		if data, err := os.ReadFile(giPath); err == nil {
			relPath, _ := filepath.Rel(dir, absTarget)
			relPath = filepath.ToSlash(relPath)

			scanner := bufio.NewScanner(strings.NewReader(string(data)))
			for scanner.Scan() {
				line := strings.TrimSpace(scanner.Text())
				if line == "" || strings.HasPrefix(line, "#") {
					continue
				}
				// Clean patterns like ".env", "/.env", "*.env", ".env*"
				cleanPattern := strings.TrimPrefix(line, "/")
				cleanPattern = strings.TrimSuffix(cleanPattern, "/")

				if strings.Contains(cleanPattern, "/") {
					if cleanPattern == relPath {
						return true, nil
					}
					if matched, _ := filepath.Match(cleanPattern, relPath); matched {
						return true, nil
					}
				} else {
					if cleanPattern == targetBase {
						return true, nil
					}
					if matched, _ := filepath.Match(cleanPattern, targetBase); matched {
						return true, nil
					}
					if matched, _ := filepath.Match(line, targetBase); matched {
						return true, nil
					}
				}
			}
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	return false, nil
}

// PrintGitIgnoreWarning writes a visible security alert to stderr when secrets are pulled
// into a file not ignored by git.
func PrintGitIgnoreWarning(outFile string) {
	clean := filepath.Clean(outFile)
	fmt.Fprintf(os.Stderr, "\n\033[33;1m⚠️  SECURITY WARNING:\033[0m %q is \033[1mNOT\033[0m ignored by .gitignore!\n", clean)
	fmt.Fprintf(os.Stderr, "Secrets written to this file could be accidentally committed to version control.\n")
	fmt.Fprintf(os.Stderr, "To secure it, add it to .gitignore:\n")
	fmt.Fprintf(os.Stderr, "  \033[32mecho %q >> .gitignore\033[0m\n\n", clean)
}
