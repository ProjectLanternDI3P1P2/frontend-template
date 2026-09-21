/**
 * ADR-FE-012 — Shared setup for every end-to-end spec.
 * ADR-FE-015 — `cy.injectAxe()` / `cy.checkA11y()` are the automated
 * accessibility check that is part of acceptance for the main journeys.
 */
import "cypress-axe";

// ADR-FE-012: a journey never depends on an unpredictable shared environment.
// Specs stub the Gateway with `cy.intercept` and fixture data instead.
beforeEach(() => {
  cy.intercept({ url: "**/api/v1/**", middleware: true }, (req) => {
    req.headers["x-e2e"] = "true";
  });
});
