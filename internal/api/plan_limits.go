package api

import "github.com/gofiber/fiber/v2"

// Free-plan limits. Paid plans (pro, enterprise) are unlimited. Keep these in
// sync with the pricing copy in web/src/components/landing/pricing.
const (
	freeMaxSecrets = 25
	freeMaxAPIKeys = 2
	freeMaxSeats   = 2
)

func (s *Server) orgOnFreePlan(orgID string) bool {
	org, err := s.DB.GetOrganizationByID(orgID)
	return err == nil && org != nil && org.Plan == "free"
}

func tierLimit(c *fiber.Ctx, msg string) error {
	return c.Status(402).JSON(fiber.Map{"error": msg, "code": "TIER_LIMIT_REACHED"})
}

// paidFeatureBlocked writes a 402 and returns true for free-plan orgs. Call it
// after permission checks so a 403 still wins over an upsell.
func (s *Server) paidFeatureBlocked(c *fiber.Ctx, feature string) bool {
	orgID, _ := c.Locals("org_id").(string)
	if !s.orgOnFreePlan(orgID) {
		return false
	}
	_ = tierLimit(c, feature+" is a Team plan feature. Upgrade on the Billing page to use it.")
	return true
}
