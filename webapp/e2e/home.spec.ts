import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Hjemmeside — kode-innlogging', () => {
  test('ugyldig kode viser feilmelding', async ({ page }) => {
    await page.fill('input[type="text"]', 'FEILKODE');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page.locator('text=Ugyldig kode. Prøv igjen.')).toBeVisible();
  });

  test('ugyldig kode via Enter viser feilmelding', async ({ page }) => {
    await page.fill('input[type="text"]', 'TULLETULL');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Ugyldig kode. Prøv igjen.')).toBeVisible();
  });

  test('KODEKNEKKEREN navigerer til /sander', async ({ page }) => {
    await page.fill('input[type="text"]', 'KODEKNEKKEREN');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/sander');
  });

  test('SPORHUNDEN navigerer til /selda', async ({ page }) => {
    await page.fill('input[type="text"]', 'SPORHUNDEN');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/selda');
  });

  test('SVEIN navigerer til /agent', async ({ page }) => {
    await page.fill('input[type="text"]', 'SVEIN');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/agent');
  });

  test('VARDEN26 navigerer til /finale', async ({ page }) => {
    await page.fill('input[type="text"]', 'VARDEN26');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/finale');
  });

  test('KOMBINER navigerer til /kombiner', async ({ page }) => {
    await page.fill('input[type="text"]', 'KOMBINER');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/kombiner');
  });

  test('koder er case-insensitive — liten bokstav fungerer', async ({ page }) => {
    await page.fill('input[type="text"]', 'kodeknekkeren');
    await page.click('button:has-text("TAST INN KODE")');
    await expect(page).toHaveURL('/sander');
  });

  test('RESET2026 tømmer localStorage og forblir på forsiden', async ({ page }) => {
    // Sett noe i localStorage først
    await page.evaluate(() => {
      localStorage.setItem('sander_dept_1_complete', 'true');
      localStorage.setItem('kombiner_done', 'true');
    });

    await page.fill('input[type="text"]', 'RESET2026');
    await page.click('button:has-text("TAST INN KODE")');

    // Forblir på forsiden
    await expect(page).toHaveURL('/');

    // localStorage skal være tømt
    const sanderDone = await page.evaluate(() => localStorage.getItem('sander_dept_1_complete'));
    const kombinerDone = await page.evaluate(() => localStorage.getItem('kombiner_done'));
    expect(sanderDone).toBeNull();
    expect(kombinerDone).toBeNull();

    // Inputfeltet skal være tømt
    await expect(page.locator('input[type="text"]')).toHaveValue('');
  });
});
