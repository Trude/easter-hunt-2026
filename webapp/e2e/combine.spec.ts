import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/kombiner');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Kombiner-siden', () => {
  test('viser 4 inntastingsfelt', async ({ page }) => {
    await expect(page.locator('input')).toHaveCount(4);
  });

  test('feil koder gir feilmelding', async ({ page }) => {
    // Fyll inn feil verdier
    await page.locator('input').nth(0).fill('99');
    await page.locator('input').nth(1).fill('99');
    await page.locator('input').nth(2).fill('FEIL');
    await page.locator('input').nth(3).fill('FEILKODE');
    await page.click('button:has-text("LÅS OPP")');
    await expect(page.locator('text=En eller flere koder er feil')).toBeVisible();
  });

  test('LÅS OPP-knapp er disabled når felt er tomme', async ({ page }) => {
    await expect(page.locator('button:has-text("LÅS OPP")')).toBeDisabled();
  });

  test('LÅS OPP-knapp er disabled når kun noen felt er fylt', async ({ page }) => {
    await page.locator('input').nth(0).fill('42');
    await page.locator('input').nth(1).fill('08');
    await expect(page.locator('button:has-text("LÅS OPP")')).toBeDisabled();
  });

  test('korrekte koder navigerer til /minecraft', async ({ page }) => {
    // Sander = 42, Selda = 08.
    // NB: Seldas felt er type="number" — leading zero (08) bevares i React state
    // fordi onChange bruker e.target.value (string), men nettleseren kan strippe
    // det ved visning. Vi bruker type+press for å sikre riktig string i state.
    await page.locator('input').nth(0).fill('42');
    // Bruk type() i stedet for fill() for number-felt med leading zero
    await page.locator('input').nth(1).click();
    await page.locator('input').nth(1).type('08');
    await page.locator('input').nth(2).fill('ONKELS');
    await page.locator('input').nth(3).fill('PÅSKEJAKT');
    await page.click('button:has-text("LÅS OPP")');
    await expect(page).toHaveURL('/minecraft');
  });

  test('kombiner_done i localStorage navigerer direkte til /minecraft med knapp', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kombiner_done', 'true'));
    await page.reload();
    await expect(page.locator('text=KOMBINER ALLEREDE FULLFØRT')).toBeVisible();
    await page.click('button:has-text("GÅ TIL MINECRAFT")');
    await expect(page).toHaveURL('/minecraft');
  });
});
