import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/finale');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Finale-siden', () => {
  test('viser vente-skjerm når ingen spillere er ferdige', async ({ page }) => {
    await expect(page.locator('text=VENTER PÅ ALLE AGENTER')).toBeVisible();
    await expect(page.locator('text=⏳')).toBeVisible();
  });

  test('viser status 0/12 for Sander og Selda', async ({ page }) => {
    await expect(page.locator('text=KODEKNEKKEREN (Sander)')).toBeVisible();
    await expect(page.locator('text=SPORHUNDEN (Selda)')).toBeVisible();
    await expect(page.locator('text=AGENT ØRANSEN (Svein)')).toBeVisible();
    // Begge viser 0/12
    const statusItems = page.locator('text=0/12');
    await expect(statusItems).toHaveCount(2); // Sander og Selda
  });

  test('viser 0/6 for Svein', async ({ page }) => {
    await expect(page.locator('text=0/6')).toBeVisible();
  });

  test('sander klar vises med checkmark når 12/12 fullført', async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 12; i++) {
        localStorage.setItem(`sander_dept_${i}_complete`, 'true');
      }
    });
    await page.reload();
    // Sander skal vises som klar
    await expect(page.locator('text=✅ KLAR').first()).toBeVisible();
  });

  test('finale-innhold vises når alle spillere er ferdige', async ({ page }) => {
    await page.evaluate(() => {
      // Sander: 12 avdelinger
      for (let i = 1; i <= 12; i++) {
        localStorage.setItem(`sander_dept_${i}_complete`, 'true');
      }
      // Selda: 12 avdelinger
      for (let i = 1; i <= 12; i++) {
        localStorage.setItem(`selda_dept_${i}_complete`, 'true');
      }
      // Svein: 6 grupper
      for (let i = 1; i <= 6; i++) {
        localStorage.setItem(`svein_dept_${i}_complete`, 'true');
      }
    });
    await page.reload();
    await expect(page.locator('text=SANDER OG SELDA')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=VIS GJEMMESTEDET')).toBeVisible();
  });

  test('VIS GJEMMESTEDET avslører VED PEISEN', async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 12; i++) {
        localStorage.setItem(`sander_dept_${i}_complete`, 'true');
        localStorage.setItem(`selda_dept_${i}_complete`, 'true');
      }
      for (let i = 1; i <= 6; i++) {
        localStorage.setItem(`svein_dept_${i}_complete`, 'true');
      }
    });
    await page.reload();
    await page.click('button:has-text("VIS GJEMMESTEDET")', { timeout: 5000 });
    await expect(page.locator('text=VED PEISEN')).toBeVisible();
    await expect(page.locator('text=4208')).toBeVisible();
  });

  test('finalen tekst er ikke synlig på vente-skjerm', async ({ page }) => {
    await expect(page.locator('text=SANDER OG SELDA')).not.toBeVisible();
    await expect(page.locator('text=VIS GJEMMESTEDET')).not.toBeVisible();
  });
});
