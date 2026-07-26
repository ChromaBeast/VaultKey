package api

import (
	"embed"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"
	"vaultkey/internal/config"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

type Server struct {
	App            *fiber.App
	DB             *db.DB
	Config         *config.Config
	WebFS          embed.FS
	LastActiveTime time.Time
	ActiveMutex    sync.Mutex
}

func NewServer(cfg *config.Config, database *db.DB, webFS embed.FS) *Server {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	s := &Server{
		App:            app,
		DB:             database,
		Config:         cfg,
		WebFS:          webFS,
		LastActiveTime: time.Now(),
	}

	s.setupRoutes()
	return s
}

func (s *Server) Start() error {
	return s.App.Listen(fmt.Sprintf(":%d", s.Config.Port))
}

func (s *Server) RecordActivity() {
	s.ActiveMutex.Lock()
	s.LastActiveTime = time.Now()
	s.ActiveMutex.Unlock()
}

func (s *Server) setupRoutes() {
	s.App.Use(s.SecurityHeadersMiddleware())
	s.App.Use(cors.New(cors.Config{
		AllowOrigins:     s.Config.AllowedOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	v1 := s.App.Group("/v1")

	authLimiter := limiter.New(limiter.Config{
		Max:        10,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(429).JSON(fiber.Map{
				"error": "too many requests, please slow down",
			})
		},
	})

	v1.Post("/auth/signup", authLimiter, s.handleSignup)
	v1.Post("/auth/login", authLimiter, s.handleLogin)
	v1.Get("/vault/status", s.handleStatus)
	v1.Get("/shares/:id", s.handleGetShare)
	v1.Post("/payments/webhook", s.handleRazorpayWebhook)

	authGroup := v1.Group("", s.AuthMiddleware())

	authGroup.Post("/vault/lock", s.handleLock)
	authGroup.Post("/shares", s.handleCreateShare)

	authGroup.Post("/secrets", s.handleCreateSecret)
	authGroup.Get("/secrets", s.handleListSecrets)
	authGroup.Get("/secrets/values", s.handleBatchGetSecrets)
	authGroup.Get("/secrets/:key", s.handleGetSecret)
	authGroup.Put("/secrets/:key", s.handleUpdateSecret)
	authGroup.Delete("/secrets/:key", s.handleDeleteSecret)
	authGroup.Get("/secrets/:key/versions", s.handleGetSecretVersions)
	authGroup.Post("/secrets/:key/rollback", s.handleRollbackSecret)

	authGroup.Post("/api-keys", s.handleCreateAPIKey)
	authGroup.Get("/api-keys", s.handleListAPIKeys)
	authGroup.Delete("/api-keys/:id", s.handleRevokeAPIKey)

	authGroup.Get("/audit", s.handleListAudit)
	authGroup.Get("/audit/verify", s.handleVerifyAudit)
	authGroup.Get("/projects", s.handleListProjects)

	authGroup.Get("/payments/config", s.handleGetRazorpayConfig)
	authGroup.Post("/payments/create-order", s.handleCreateRazorpayOrder)
	authGroup.Post("/payments/verify", s.handleVerifyRazorpayPayment)
	authGroup.Get("/payments/history", s.handleListPayments)

	authGroup.Post("/subscriptions/create", s.handleCreateSubscription)
	authGroup.Post("/subscriptions/verify", s.handleVerifySubscription)
	authGroup.Post("/subscriptions/cancel", s.handleCancelSubscription)

	// Serve static asset files (/assets/index-xxx.js, /favicon.svg, etc.)
	s.App.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(s.WebFS),
		PathPrefix: "web/dist",
		MaxAge:     31536000,
	}))

	// SPA Fallback Handler for React Router client-side routes (/secrets, /billing, /keys, /audit, /docs, etc.)
	s.App.Get("*", func(c *fiber.Ctx) error {
		path := c.Path()
		if strings.HasPrefix(path, "/v1/") {
			return c.Status(404).JSON(fiber.Map{"error": "endpoint not found"})
		}
		c.Set("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Set("Content-Type", "text/html; charset=utf-8")
		indexBytes, err := s.WebFS.ReadFile("web/dist/index.html")
		if err != nil {
			return c.Status(500).SendString("Index file missing")
		}
		return c.Send(indexBytes)
	})
}
