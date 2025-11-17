import { test, expect } from "@playwright/test";

const PREMIUM_CARD_TEST_ID = "protocol-card-eme";

test.describe("Accès aux fiches premium", () => {
  test("un invité voit une invite de connexion lorsqu'il clique sur une fiche premium", async ({ page }) => {
    await page.goto("/");
    const premiumCard = page.getByTestId(PREMIUM_CARD_TEST_ID);
    await expect(premiumCard).toBeVisible();
    await premiumCard.click();
    await expect(page.getByRole("dialog", { name: /accès réservé/i })).toBeVisible();
    await expect(page.getByText(/fiches premium PediaGo\+/i)).toBeVisible();
  });

  test("un invité est redirigé vers la page abonnement sur une fiche premium", async ({ page }) => {
    await page.goto("/protocols/eme");
    await page.waitForURL(/mon-compte/);
    await expect(page).toHaveURL(/reason=premium/);
    await expect(page.getByText(/Abonnement requis pour cette fiche premium/i)).toBeVisible();
  });
});
