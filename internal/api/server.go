package api

import (
	"embed"
	"fmt"
	"net/http"
	"sync"
	"time"
	"vaultkey/internal/config"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
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

	authGroup.Post("/api-keys", s.handleCreateAPIKey)
	authGroup.Get("/api-keys", s.handleListAPIKeys)
	authGroup.Delete("/api-keys/:id", s.handleRevokeAPIKey)

	authGroup.Get("/audit", s.handleListAudit)
	authGroup.Get("/audit/verify", s.handleVerifyAudit)
	authGroup.Get("/projects", s.handleListProjects)

	s.App.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(s.WebFS),
		PathPrefix: "web/dist",
	}))
}
