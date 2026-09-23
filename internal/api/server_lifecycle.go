package api

import (
	"fmt"
	"log"
	"sync"
	"time"
	"vaultkey/internal/crypto"
)

func (s *Server) Start() error {
	go s.autoLockLoop()
	return s.App.Listen(fmt.Sprintf(":%d", s.Config.Port))
}

func (s *Server) Shutdown() error {
	close(s.stopAutoLock)
	return s.App.ShutdownWithTimeout(10 * time.Second)
}

func (s *Server) autoLockLoop() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	subscriptionTicker := time.NewTicker(5 * time.Minute)
	defer subscriptionTicker.Stop()
	s.downgradeExpiredSubscriptions()
	for {
		select {
		case <-s.stopAutoLock:
			return
		case <-ticker.C:
			s.lockIdleOrgs()
		case <-subscriptionTicker.C:
			s.downgradeExpiredSubscriptions()
		}
	}
}

func (s *Server) downgradeExpiredSubscriptions() {
	orgIDs, err := s.DB.DowngradeExpiredSubscriptions(time.Now())
	if err != nil {
		log.Printf("subscription expiry sweep failed: %v", err)
		return
	}
	for _, orgID := range orgIDs {
		if err := s.LogAuditOrg(orgID, "SUBSCRIPTION_EXPIRED", nil, nil, "system", "", ""); err != nil {
			log.Printf("failed to audit subscription expiry for %s: %v", orgID, err)
		}
	}
}

func (s *Server) lockIdleOrgs() {
	idleLimit := s.Config.AutoLock()
	now := time.Now()
	s.ActiveMutex.Lock()
	defer s.ActiveMutex.Unlock()
	for orgID, last := range s.lastActivity {
		if now.Sub(last) > idleLimit && !crypto.Global.IsLocked(orgID) {
			crypto.Global.Lock(orgID)
			delete(s.lastActivity, orgID)
		}
	}
}

func (s *Server) RecordActivity(orgID string) {
	s.ActiveMutex.Lock()
	s.lastActivity[orgID] = time.Now()
	s.ActiveMutex.Unlock()
}

func (s *Server) auditMutexFor(orgID string) *sync.Mutex {
	s.auditLocksMu.Lock()
	defer s.auditLocksMu.Unlock()
	m, ok := s.auditLocks[orgID]
	if !ok {
		m = &sync.Mutex{}
		s.auditLocks[orgID] = m
	}
	return m
}
