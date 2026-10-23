package main

import (
	"testing"
)

func TestToStringSlice(t *testing.T) {
	// nil input
	if res := toStringSlice(nil); res != nil {
		t.Fatalf("expected nil, got %v", res)
	}

	// []string input
	inStr := []string{"FOO", "BAR"}
	resStr := toStringSlice(inStr)
	if len(resStr) != 2 || resStr[0] != "FOO" || resStr[1] != "BAR" {
		t.Fatalf("expected [FOO BAR], got %v", resStr)
	}

	// []any input
	inAny := []any{"BAZ", "QUX", 123}
	resAny := toStringSlice(inAny)
	if len(resAny) != 2 || resAny[0] != "BAZ" || resAny[1] != "QUX" {
		t.Fatalf("expected [BAZ QUX], got %v", resAny)
	}
}

func TestToolErr(t *testing.T) {
	errResult := toolErr("sample error with code %d", 404)
	if !errResult.IsError {
		t.Fatalf("expected IsError to be true")
	}
}
