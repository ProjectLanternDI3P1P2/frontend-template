describe("combat prototype", () => {
  it("opens the encounter and enters tactical combat", () => {
    cy.visit("/combat");
    cy.get(".arena__fight").click();
    cy.contains("Turn 3 — the enemies reveal their intent").should(
      "be.visible",
    );
    cy.get("#combat-state").select("planning");
    cy.contains("button", "Lock action").click();
    cy.contains("button", "Unlock").should("be.visible").click();
    cy.get(".skill-card").contains("Swap place").click();
    cy.get('button[aria-label="Target Player 3"]').click();
    cy.contains("button", "Lock action").click();
    cy.contains("button", "Simulate party ready").click();
    cy.contains("Mage ↔ Rogue · ranks swapped").should("exist");
  });
  it("filters and pins a known combo", () => {
    cy.visit("/combat?view=bestiary");
    cy.get(".bestiary__filters").contains("button", "Druid").click();
    cy.get("table").contains("button", "Mudlock").click();
    cy.get(".bestiary__detail .ui-panel__body > h3").should(
      "have.text",
      "Mudlock",
    );
    cy.contains("button", "Pin as combo hint").click();
    cy.contains("button", "Pinned for the party").should("be.visible");
  });
  it("renders every local image and keeps phone layouts within the viewport", () => {
    cy.viewport(390, 844);
    cy.visit("/combat?view=tactics");
    cy.get(".combat-topbar").should("be.visible");
    cy.get("img").each(($img) => {
      expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
    });
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(390);
    });
  });
});
